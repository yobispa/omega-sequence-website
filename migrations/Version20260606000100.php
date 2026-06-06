<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260606000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the application user table for authentication and dashboard access.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE app_user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(80) DEFAULT NULL, last_name VARCHAR(80) DEFAULT NULL, display_name VARCHAR(120) DEFAULT NULL, timezone VARCHAR(64) NOT NULL, preferred_locale VARCHAR(8) NOT NULL, account_status VARCHAR(24) NOT NULL, membership_tier VARCHAR(24) NOT NULL, is_verified TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, last_login_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON app_user (email)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE app_user');
    }
}
