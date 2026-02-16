import { getMatches } from '@/lib/api';
import { getUserPredictions, getUserBracketPredictions } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        userId: string;
    };
}

export default async function UserPredictionsPage({ params }: PageProps) {
    const { userId } = await params;

    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
    });

    if (!user) {
        notFound();
    }

    const matches = await getMatches();
    const predictions = await getUserPredictions(userId);
    const bracketPredictions = await getUserBracketPredictions(userId);

    // Create prediction map for quick lookup
    const predictionMap = new Map(
        predictions.map(p => [p.matchId, { home: p.homeScore, away: p.awayScore }])
    );

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 sm:mb-12 md:mb-16 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
                            PRONÓSTICOS DE <span className="text-white">{(user.name ?? 'USUARIO').toUpperCase()}</span>
                        </h1>
                        <p className="text-fifa-gray-light font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-40 text-[10px] sm:text-xs">
                            Todas las predicciones realizadas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <Link
                            href="/leaderboard"
                            className="px-6 py-4 rounded-2xl glass-card text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase text-center touch-target"
                        >
                            VOLVER
                        </Link>
                    </div>
                </header>

                {/* Group Stage Predictions */}
                <section className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Fase de Grupos</h2>
                    <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden backdrop-blur-md">
                        {matches
                            .filter(m => m.stage === 'GROUP_STAGE')
                            .map(match => {
                                const prediction = predictionMap.get(match.id.toString());
                                const isFinished = match.status === 'FINISHED';
                                const realScore = match.score.fullTime;

                                return (
                                    <div
                                        key={match.id}
                                        className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 text-right">
                                                <span className="text-white font-medium">{match.homeTeam.name}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {prediction ? (
                                                    <>
                                                        <span className="text-2xl font-black text-fifa-cyan w-8 text-center">
                                                            {prediction.home}
                                                        </span>
                                                        <span className="text-fifa-gray-light">-</span>
                                                        <span className="text-2xl font-black text-fifa-cyan w-8 text-center">
                                                            {prediction.away}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-fifa-gray-light italic">Sin pronóstico</span>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <span className="text-white font-medium">{match.awayTeam.name}</span>
                                            </div>

                                            {isFinished && (
                                                <div className="ml-4 text-right text-sm">
                                                    <div className="text-fifa-gray-light">Real:</div>
                                                    <div className="text-white font-bold">
                                                        {realScore.home} - {realScore.away}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </section>

                {/* Bracket Predictions */}
                {bracketPredictions.length > 0 && (
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Fase Final</h2>
                        <div className="bg-white/10 rounded-2xl border border-white/20 p-6 backdrop-blur-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bracketPredictions.map((pred, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="text-fifa-gray-light text-xs uppercase mb-2">
                                            {pred.stage} - Partido {pred.position}
                                        </div>
                                        <div className="text-white font-medium">
                                            {pred.homeTeamName || 'Por definirse'} vs {pred.awayTeamName || 'Por definirse'}
                                        </div>
                                        {pred.homeScore !== null && pred.awayScore !== null && (
                                            <div className="text-fifa-cyan font-bold mt-2">
                                                {pred.homeScore} - {pred.awayScore}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
