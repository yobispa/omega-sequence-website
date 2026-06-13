<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserLessonProgress;
use App\Repository\UserLessonProgressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class DashboardController extends AbstractController
{
    public function __construct(
        private readonly UserLessonProgressRepository $lessonProgressRepository,
    ) {
    }

    #[Route('/dashboard', name: 'app_dashboard')]
    #[IsGranted('ROLE_USER')]
    public function index(): Response
    {
        $currentPhase = $this->getPhases()[0];
        $user = $this->getCurrentUser();

        return $this->render('dashboard/index.html.twig', $this->buildDashboardContext([
            'active_nav' => 'lessons',
            'completed_lesson_ids' => $this->lessonProgressRepository->findCompletedLessonIds($user, $currentPhase['number']),
        ]));
    }

    #[Route('/dashboard/route-path', name: 'app_dashboard_route_path')]
    #[IsGranted('ROLE_USER')]
    public function routePath(): Response
    {
        return $this->render('dashboard/route_path.html.twig', $this->buildDashboardContext([
            'active_nav' => 'route',
        ]));
    }

    #[Route('/dashboard/lessons/{lessonId}/completion', name: 'app_dashboard_lesson_completion', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function lessonCompletion(string $lessonId, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            $payload = [];
        }

        if (!$this->isCsrfTokenValid('lesson_progress', (string) ($payload['_token'] ?? ''))) {
            return $this->json(['error' => 'Invalid progress token.'], Response::HTTP_FORBIDDEN);
        }

        $validLessonIds = array_column($this->getVideoLessons(), 'id');
        if (!in_array($lessonId, $validLessonIds, true)) {
            return $this->json(['error' => 'Unknown lesson.'], Response::HTTP_NOT_FOUND);
        }

        $phaseNumber = $this->normalizePhaseNumber((string) ($payload['phase'] ?? '01'));
        $completed = filter_var($payload['completed'] ?? true, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? true;
        $user = $this->getCurrentUser();
        $lessonIndex = array_search($lessonId, $validLessonIds, true);

        if (true === $completed && is_int($lessonIndex) && $lessonIndex > 0) {
            $completedLessonIds = $this->lessonProgressRepository->findCompletedLessonIds($user, $phaseNumber);
            $requiredPreviousLessons = array_slice($validLessonIds, 0, $lessonIndex);
            $missingPreviousLessons = array_diff($requiredPreviousLessons, $completedLessonIds);

            if ($missingPreviousLessons !== []) {
                return $this->json([
                    'error' => 'Previous lessons must be completed first.',
                    'missing_lesson_ids' => array_values($missingPreviousLessons),
                ], Response::HTTP_CONFLICT);
            }
        }

        $progress = $this->lessonProgressRepository->findOneBy([
            'user' => $user,
            'phaseNumber' => $phaseNumber,
            'lessonId' => $lessonId,
        ]);

        if (!$progress instanceof UserLessonProgress) {
            $progress = (new UserLessonProgress())
                ->setUser($user)
                ->setPhaseNumber($phaseNumber)
                ->setLessonId($lessonId);

            $entityManager->persist($progress);
        }

        $progress->setIsCompleted($completed);
        $entityManager->flush();

        $completedLessonIds = $this->lessonProgressRepository->findCompletedLessonIds($user, $phaseNumber);
        $lessonCount = count($validLessonIds);

        return $this->json([
            'completed_lesson_ids' => $completedLessonIds,
            'completed_count' => count($completedLessonIds),
            'lesson_count' => $lessonCount,
            'all_videos_completed' => count($completedLessonIds) === $lessonCount,
        ]);
    }

    /**
     * @param array<string, mixed> $extraContext
     *
     * @return array<string, mixed>
     */
    private function buildDashboardContext(array $extraContext = []): array
    {
        $phases = $this->getPhases();
        $videoLessons = $this->getVideoLessons();

        return array_merge([
            'current_phase' => $phases[0],
            'phases' => $phases,
            'video_lessons' => $videoLessons,
            'lesson_count' => count($videoLessons),
            'completed_lesson_ids' => [],
            'mentor_checks' => [
                ['label' => 'Videos completed', 'value' => '0 / '.count($videoLessons), 'icon' => 'play-circle'],
                ['label' => 'Chart examples', 'value' => '0 / 15', 'icon' => 'images'],
                ['label' => 'Assessment', 'value' => 'Pending', 'icon' => 'badge-help'],
                ['label' => 'Next phase', 'value' => 'Locked', 'icon' => 'route'],
            ],
        ], $extraContext);
    }

    private function getCurrentUser(): User
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw $this->createAccessDeniedException();
        }

        return $user;
    }

    private function normalizePhaseNumber(string $phaseNumber): string
    {
        $digits = preg_replace('/[^0-9]/', '', $phaseNumber) ?: '1';

        return str_pad(substr($digits, 0, 2), 2, '0', STR_PAD_LEFT);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getPhases(): array
    {
        return [
            [
                'number' => '01',
                'title' => 'Foundation Map',
                'summary' => 'Understand the Omega lens, DR / IDR sessions, and the rules of study.',
                'status' => 'active',
                'lessons' => 4,
                'duration' => '1h 00m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Pending',
                'icon' => 'map',
            ],
            [
                'number' => '02',
                'title' => 'Liquidity Context',
                'summary' => 'Mark external/internal liquidity and prepare clean chart examples.',
                'status' => 'locked',
                'lessons' => 8,
                'duration' => '3h 05m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Locked',
                'icon' => 'waves',
            ],
            [
                'number' => '03',
                'title' => 'Displacement & Rebalance',
                'summary' => 'Read delivery legs, imbalance, mitigation, and the first Omega transition.',
                'status' => 'locked',
                'lessons' => 7,
                'duration' => '2h 50m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Locked',
                'icon' => 'activity',
            ],
            [
                'number' => '04',
                'title' => 'Expansion Model',
                'summary' => 'Build the execution map from session range into directional delivery.',
                'status' => 'locked',
                'lessons' => 9,
                'duration' => '4h 10m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Locked',
                'icon' => 'trending-up',
            ],
            [
                'number' => '05',
                'title' => 'Terminus Rule',
                'summary' => 'Identify exhaustion, terminus behavior, and reset conditions.',
                'status' => 'locked',
                'lessons' => 6,
                'duration' => '2h 35m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Locked',
                'icon' => 'flag',
            ],
            [
                'number' => '06',
                'title' => 'Live Model Review',
                'summary' => 'Submit a complete sequence review and prepare for grading.',
                'status' => 'locked',
                'lessons' => 5,
                'duration' => '2h 00m',
                'examples_required' => 15,
                'examples_uploaded' => 0,
                'assessment' => 'Locked',
                'icon' => 'graduation-cap',
            ],
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function getVideoLessons(): array
    {
        return [
            ['id' => 'phase-01-welcome', 'title' => 'Welcome to Omega Sequence', 'phase' => 'Phase 01', 'duration' => '08:12'],
            ['id' => 'phase-01-study-model', 'title' => 'How to Study the Model', 'phase' => 'Phase 01', 'duration' => '14:40'],
            ['id' => 'phase-01-session-anatomy', 'title' => 'DR / IDR Session Anatomy', 'phase' => 'Phase 01', 'duration' => '26:05'],
            ['id' => 'phase-01-chart-standards', 'title' => 'Chart Example Standards', 'phase' => 'Phase 01', 'duration' => '11:30'],
        ];
    }
}
