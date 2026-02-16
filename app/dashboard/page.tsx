import { getMatches } from '@/lib/api';
import { getUserPredictions, getUserBracketPredictions } from '@/app/actions';
import DashboardClient from '@/components/DashboardClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LiveMatchMonitor from '@/components/LiveMatchMonitor';

export default async function Dashboard() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        redirect('/');
    }

    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.role === 'ADMIN';

    const matches = await getMatches();
    const predictions = await getUserPredictions(userId);
    const bracketPredictions = await getUserBracketPredictions(userId);

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-10 sm:mb-12 md:mb-16 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
                        MIS <span className="text-white">PRONÓSTICOS</span>
                    </h1>
                    <p className="text-fifa-gray-light font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-40 text-[10px] sm:text-xs">
                        Copa Mundial FIFA 2026 • Portal de Predicciones
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Link
                        href="/leaderboard"
                        className="px-6 py-4 rounded-2xl glass-card text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase text-center touch-target"
                    >
                        VER CLASIFICACIÓN
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/admin/scoring"
                            className="px-6 py-4 rounded-2xl bg-fifa-cyan/10 text-fifa-cyan hover:bg-fifa-cyan/20 border border-fifa-cyan/20 hover:border-fifa-cyan/40 transition-all font-black text-xs tracking-widest uppercase text-center touch-target"
                        >
                            ⚙️ ADMIN
                        </Link>
                    )}

                    <form action={async () => {
                        'use server';
                        const { logoutUser } = await import('../actions');
                        await logoutUser();
                    }} className={isAdmin ? "" : "sm:col-span-2 lg:col-span-1"}>
                        <button className="w-full px-6 py-4 rounded-2xl bg-fifa-red/5 text-fifa-red hover:bg-fifa-red/10 border border-fifa-red/20 transition-all font-black text-xs tracking-widest uppercase touch-target">
                            SALIR
                        </button>
                    </form>
                </div>
            </header>

            <main className="space-y-12">
                <DashboardClient
                    userId={userId}
                    matches={matches}
                    initialPredictions={predictions}
                    bracketPredictions={bracketPredictions}
                />
            </main>

            {/* Live Match Monitor for automatic updates */}
            <LiveMatchMonitor matches={matches} />
        </div>
    );
}
