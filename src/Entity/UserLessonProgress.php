<?php

namespace App\Entity;

use App\Repository\UserLessonProgressRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserLessonProgressRepository::class)]
#[ORM\Table(name: 'user_lesson_progress')]
#[ORM\UniqueConstraint(name: 'UNIQ_USER_PHASE_LESSON', fields: ['user', 'phaseNumber', 'lessonId'])]
#[ORM\HasLifecycleCallbacks]
class UserLessonProgress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\Column(length: 8)]
    private string $phaseNumber = '01';

    #[ORM\Column(length: 120)]
    private string $lessonId = '';

    #[ORM\Column]
    private bool $isCompleted = false;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $completedAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getPhaseNumber(): string
    {
        return $this->phaseNumber;
    }

    public function setPhaseNumber(string $phaseNumber): static
    {
        $this->phaseNumber = $phaseNumber;

        return $this;
    }

    public function getLessonId(): string
    {
        return $this->lessonId;
    }

    public function setLessonId(string $lessonId): static
    {
        $this->lessonId = $lessonId;

        return $this;
    }

    public function isCompleted(): bool
    {
        return $this->isCompleted;
    }

    public function setIsCompleted(bool $isCompleted): static
    {
        $this->isCompleted = $isCompleted;
        $this->completedAt = $isCompleted ? new \DateTimeImmutable() : null;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getCompletedAt(): ?\DateTimeImmutable
    {
        return $this->completedAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    #[ORM\PreUpdate]
    public function touchUpdatedAt(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
