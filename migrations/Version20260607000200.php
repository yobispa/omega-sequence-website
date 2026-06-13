<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260607000200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Align lesson progress table with Doctrine platform metadata.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_lesson_progress DROP FOREIGN KEY `FK_14F46A7FA76ED395`');
        $this->addSql('ALTER TABLE user_lesson_progress CHANGE created_at created_at DATETIME NOT NULL, CHANGE completed_at completed_at DATETIME DEFAULT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('DROP INDEX idx_14f46a7fa76ed395 ON user_lesson_progress');
        $this->addSql('CREATE INDEX IDX_789AD4D0A76ED395 ON user_lesson_progress (user_id)');
        $this->addSql('ALTER TABLE user_lesson_progress ADD CONSTRAINT `FK_14F46A7FA76ED395` FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_lesson_progress DROP FOREIGN KEY `FK_14F46A7FA76ED395`');
        $this->addSql('DROP INDEX IDX_789AD4D0A76ED395 ON user_lesson_progress');
        $this->addSql('ALTER TABLE user_lesson_progress CHANGE created_at created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE completed_at completed_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE updated_at updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE INDEX IDX_14F46A7FA76ED395 ON user_lesson_progress (user_id)');
        $this->addSql('ALTER TABLE user_lesson_progress ADD CONSTRAINT `FK_14F46A7FA76ED395` FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE');
    }
}
