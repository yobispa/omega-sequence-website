<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-user',
    description: 'Create a dashboard user account.',
)]
final class CreateUserCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserRepository $userRepository,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Login email address')
            ->addArgument('password', InputArgument::REQUIRED, 'Plain password to hash')
            ->addOption('display-name', null, InputOption::VALUE_OPTIONAL, 'Dashboard display name')
            ->addOption('tier', null, InputOption::VALUE_OPTIONAL, 'Membership tier', 'free')
            ->addOption('admin', null, InputOption::VALUE_NONE, 'Grant ROLE_ADMIN');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = (string) $input->getArgument('email');

        if ($this->userRepository->findOneBy(['email' => strtolower(trim($email))])) {
            $io->error(sprintf('A user with email "%s" already exists.', $email));

            return Command::FAILURE;
        }

        $user = (new User())
            ->setEmail($email)
            ->setDisplayName($input->getOption('display-name') ?: null)
            ->setMembershipTier((string) $input->getOption('tier'))
            ->setIsVerified(true);

        if ($input->getOption('admin')) {
            $user->setRoles(['ROLE_ADMIN']);
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, (string) $input->getArgument('password')));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $io->success(sprintf('Created dashboard user "%s".', $user->getEmail()));

        return Command::SUCCESS;
    }
}
