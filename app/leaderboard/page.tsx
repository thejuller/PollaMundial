import { getLeaderboard } from '@/lib/data';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();

    return (
        <div className="min-h-screen text-fifa-white p-4 sm:p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 sm:mb-12 md:mb-16 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
                            CLASIFICACIÓN <span className="text-white">26</span>
                        </h1>
                        <p className="text-fifa-gray-light font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-40 text-[10px] sm:text-xs">
                            Tabla de posiciones oficial
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <Link
                            href="/dashboard"
                            className="px-6 py-4 rounded-2xl glass-card text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase text-center touch-target"
                        >
                            VOLVER
                        </Link>
                    </div>
                </header>

                {/* Mobile Cards View (< md) */}
                <div className="md:hidden space-y-4">
                    {leaderboard.map((entry, index) => (
                        <div key={entry.userId} className="bg-white/20 rounded-2xl border border-white/30 overflow-hidden backdrop-blur-lg shadow-xl p-5 hover:bg-white/25 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-fifa-gray-light font-mono text-lg font-bold">#{index + 1}</span>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${index === 0 ? 'bg-fifa-green text-white shadow-lg shadow-fifa-green/30' :
                                        index === 1 ? 'bg-fifa-blue text-white shadow-lg shadow-fifa-blue/30' :
                                            index === 2 ? 'bg-fifa-red text-white shadow-lg shadow-fifa-red/30' :
                                                'bg-white/10 text-fifa-gray-light'
                                        }`}>
                                        {entry.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-white">{entry.points}</div>
                                    <div className="text-xs text-fifa-gray-light uppercase tracking-wider">puntos</div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-bold text-white text-lg">{entry.name}</h3>
                            </div>

                            <div className="flex justify-between items-center text-sm mb-4">
                                <div className="flex gap-4">
                                    <div>
                                        <span className="text-fifa-green font-bold text-lg">{entry.exactMatches}</span>
                                        <span className="text-fifa-gray-light text-xs ml-1">Exacto</span>
                                    </div>
                                    <div>
                                        <span className="text-fifa-blue font-bold text-lg">{entry.correctResults}</span>
                                        <span className="text-fifa-gray-light text-xs ml-1">Correcto</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/predictions/${entry.userId}`}
                                className="fifa-button fifa-button-primary block w-full py-4 rounded-xl font-black text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all touch-target text-center"
                            >
                                VER PRONÓSTICOS
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View (>= md) */}
                <div className="hidden md:block bg-white/20 rounded-3xl border border-white/30 overflow-hidden backdrop-blur-lg shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/20 text-white border-b border-white/20">
                            <tr>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase">Posición</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase">Jugador</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase text-center">Exacto (7pts)</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase text-center">Correcto (3pts)</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase text-right">Puntos</th>
                                <th className="px-6 py-5 font-bold tracking-wider text-xs uppercase text-center">Pronósticos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.map((entry, index) => (
                                <tr key={entry.userId} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5 font-mono text-fifa-gray-light text-lg">#{index + 1}</td>
                                    <td className="px-6 py-5 font-bold text-white flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${index === 0 ? 'bg-fifa-green text-white shadow-lg shadow-fifa-green/30' :
                                            index === 1 ? 'bg-fifa-blue text-white shadow-lg shadow-fifa-blue/30' :
                                                index === 2 ? 'bg-fifa-red text-white shadow-lg shadow-fifa-red/30' :
                                                    'bg-white/10 text-fifa-gray-light group-hover:bg-white/15'
                                            }`}>
                                            {entry.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="tracking-wide">{entry.name}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-fifa-green font-bold text-lg">{entry.exactMatches}</td>
                                    <td className="px-6 py-5 text-center text-fifa-blue font-bold text-lg">{entry.correctResults}</td>
                                    <td className="px-6 py-5 text-right font-black text-2xl text-white">{entry.points}</td>
                                    <td className="px-6 py-5 text-center">
                                        <Link
                                            href={`/predictions/${entry.userId}`}
                                            className="fifa-button fifa-button-primary inline-block px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all touch-target"
                                        >
                                            VER
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {leaderboard.length === 0 && (
                        <div className="p-12 text-center text-fifa-gray-light">
                            No hay participantes aún. ¡Sé el primero en unirte!
                        </div>
                    )}
                </div>

                {/* Mobile Empty State */}
                {leaderboard.length === 0 && (
                    <div className="md:hidden p-8 text-center text-fifa-gray-light bg-white/10 rounded-2xl border border-white/20">
                        No hay participantes aún. ¡Sé el primero en unirte!
                    </div>
                )}
            </div>
        </div>
    );
}
