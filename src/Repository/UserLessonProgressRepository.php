<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\UserLessonProgress;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserLessonProgress>
 */
class UserLessonProgressRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserLessonProgress::class);
    }

    /**
     * @return list<string>
     */
    public function findCompletedLessonIds(User $user, string $phaseNumber): array
    {
        $rows = $this->createQueryBuilder('progress')
            ->select('progress.lessonId')
            ->andWhere('progress.user = :user')
            ->andWhere('progress.phaseNumber = :phaseNumber')
            ->andWhere('progress.isCompleted = true')
            ->setParameter('user', $user)
            ->setParameter('phaseNumber', $phaseNumber)
            ->orderBy('progress.lessonId', 'ASC')
            ->getQuery()
            ->getScalarResult();

        return array_values(array_map(static fn (array $row): string => (string) $row['lessonId'], $rows));
    }
}
