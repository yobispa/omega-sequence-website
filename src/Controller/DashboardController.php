<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    #[IsGranted('ROLE_USER')]
    public function index(): Response
    {
        $datasetPairs = [
            [
                'symbol' => 'EUR/USD',
                'slug' => 'eurusd',
                'market' => 'FX Major',
                'status' => 'Preview',
                'coverage' => 'Pending import',
                'timeframes' => '1m / 5m / 15m / 1h',
                'sessions' => 'London, NY AM',
                'records' => '0',
                'last_update' => 'Awaiting mentor upload',
                'bias' => 'Neutral',
                'source' => 'assets/pairs/eurusd',
            ],
            [
                'symbol' => 'GBP/USD',
                'slug' => 'gbpusd',
                'market' => 'FX Major',
                'status' => 'Preview',
                'coverage' => 'Pending import',
                'timeframes' => '1m / 5m / 15m / 1h',
                'sessions' => 'London, NY AM',
                'records' => '0',
                'last_update' => 'Awaiting mentor upload',
                'bias' => 'Neutral',
                'source' => 'assets/pairs/gbpusd',
            ],
            [
                'symbol' => 'USD/JPY',
                'slug' => 'usdjpy',
                'market' => 'FX Major',
                'status' => 'Queued',
                'coverage' => 'Pending import',
                'timeframes' => '5m / 15m / 1h',
                'sessions' => 'Asia, NY AM',
                'records' => '0',
                'last_update' => 'Dataset not published',
                'bias' => 'Neutral',
                'source' => 'assets/pairs/usdjpy',
            ],
            [
                'symbol' => 'XAU/USD',
                'slug' => 'xauusd',
                'market' => 'Metals',
                'status' => 'Queued',
                'coverage' => 'Pending import',
                'timeframes' => '1m / 5m / 15m',
                'sessions' => 'London, NY AM',
                'records' => '0',
                'last_update' => 'Dataset not published',
                'bias' => 'Neutral',
                'source' => 'assets/pairs/xauusd',
            ],
            [
                'symbol' => 'BTC/USD',
                'slug' => 'btcusd',
                'market' => 'Crypto',
                'status' => 'Research',
                'coverage' => 'Pending import',
                'timeframes' => '5m / 15m / 4h',
                'sessions' => '24h',
                'records' => '0',
                'last_update' => 'Research queue',
                'bias' => 'Neutral',
                'source' => 'assets/pairs/btcusd',
            ],
        ];

        return $this->render('dashboard/index.html.twig', [
            'dataset_pairs' => $datasetPairs,
            'selected_pair' => $datasetPairs[0],
            'workspace_stats' => [
                ['label' => 'Pairs visible', 'value' => '5', 'meta' => 'Read-only user library', 'icon' => 'database'],
                ['label' => 'Published rows', 'value' => '0', 'meta' => 'Waiting for mentor data', 'icon' => 'table-properties'],
                ['label' => 'Sessions mapped', 'value' => '3', 'meta' => 'Asia, London, NY AM', 'icon' => 'clock-3'],
                ['label' => 'User uploads', 'value' => 'Off', 'meta' => 'Mentor/admin controlled', 'icon' => 'lock-keyhole'],
            ],
            'activity_items' => [
                ['title' => 'Dataset library shell', 'time' => 'Today', 'detail' => 'Users can browse pair pages without upload permissions.'],
                ['title' => 'Admin source folder', 'time' => 'Ready', 'detail' => 'Mentor data can be staged under assets/pairs by symbol.'],
                ['title' => 'Historical import layer', 'time' => 'Next', 'detail' => 'Connect CSV/JSON readers once the pair data format is locked.'],
            ],
        ]);
    }
}
