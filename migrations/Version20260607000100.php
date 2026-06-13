<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260607000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Track per-user video lesson completion for mentorship phases.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE user_lesson_progress (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, phase_number VARCHAR(8) NOT NULL, lesson_id VARCHAR(120) NOT NULL, is_completed TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', completed_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_14F46A7FA76ED395 (user_id), UNIQUE INDEX UNIQ_USER_PHASE_LESSON (user_id, phase_number, lesson_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_lesson_progress ADD CONSTRAINT FK_14F46A7FA76ED395 FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_lesson_progress DROP FOREIGN KEY FK_14F46A7FA76ED395');
        $this->addSql('DROP TABLE user_lesson_progress');
    }
}
