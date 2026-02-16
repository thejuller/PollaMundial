'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MatchData } from '@/lib/api';
import { hasActiveMatches } from '@/lib/matchTiming';

interface LiveMatchMonitorProps {
    matches: MatchData[];
}

export default function LiveMatchMonitor({ matches }: LiveMatchMonitorProps) {
    const router = useRouter();
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        // Check if there are active matches
        const hasActive = hasActiveMatches(matches);
        setIsPolling(hasActive);

        if (!hasActive) {
            return;
        }

        // Set up polling interval (30 seconds)
        const pollInterval = setInterval(() => {
            console.log('🔄 Refreshing match data (live matches detected)...');
            router.refresh(); // Triggers server component re-fetch
        }, 30000); // 30 seconds

        // Cleanup on unmount or when active matches change
        return () => {
            clearInterval(pollInterval);
        };
    }, [matches, router]);

    // Visual indicator (optional)
    if (!isPolling) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="px-4 py-2 bg-fifa-green/90 backdrop-blur-sm border border-fifa-green/50 rounded-full shadow-xl flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span className="text-white text-xs font-bold tracking-wider uppercase">
                    Actualización en vivo
                </span>
            </div>
        </div>
    );
}
