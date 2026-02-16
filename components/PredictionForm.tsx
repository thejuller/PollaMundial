'use client';

import { MatchData } from '@/lib/api';
import { submitPrediction } from '@/app/actions';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { translateTeam, translateStatus, translateGroup } from '@/lib/translations';

interface PredictionFormProps {
    userId: string;
    matches: MatchData[];
    initialPredictions: { matchId: string; homeScore: number; awayScore: number }[];
}

export default function PredictionForm({ userId, matches, initialPredictions }: PredictionFormProps) {
    const [predictions, setPredictions] = useState(
        initialPredictions.reduce((acc, pred) => {
            acc[pred.matchId] = { home: pred.homeScore, away: pred.awayScore };
            return acc;
        }, {} as Record<string, { home: number; away: number }>)
    );

    // Track which matches have been saved (locked)
    const [savedMatches, setSavedMatches] = useState<Set<number>>(
        new Set(initialPredictions.map(p => parseInt(p.matchId)))
    );

    const [loading, setLoading] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, string>>({});

    const handlePredictionChange = (matchId: number, type: 'home' | 'away', value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;

        setPredictions((prev) => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [type]: numValue,
            },
        }));
    };

    const savePrediction = async (matchId: number) => {
        const pred = predictions[matchId];
        if (!pred || pred.home === undefined || pred.away === undefined) return;

        setLoading(matchId.toString());
        try {
            const match = matches.find(m => m.id === matchId);
            if (!match) throw new Error("Match not found");

            await submitPrediction(
                userId,
                matchId.toString(),
                pred.home,
                pred.away,
                {
                    homeTeam: translateTeam(match.homeTeam.name),
                    awayTeam: translateTeam(match.awayTeam.name),
                    date: match.utcDate,
                    status: translateStatus(match.status)
                }
            );

            // Mark this match as saved (locked)
            setSavedMatches(prev => new Set(prev).add(matchId));

            setMessages((prev) => ({ ...prev, [matchId]: '¡Guardado!' }));
            setTimeout(() => setMessages((prev) => ({ ...prev, [matchId]: '' })), 2000);
        } catch (error) {
            console.error(error);
            setMessages((prev) => ({ ...prev, [matchId]: '¡Error!' }));
        } finally {
            setLoading(null);
        }
    };

    const groupedMatches = useMemo(() => {
        const groups: Record<string, MatchData[]> = {};
        matches.forEach(match => {
            const groupName = match.group || 'Sin Grupo'; // Handle matches without a group if any
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(match);
        });

        // Sort groups alphabetically (Group A, Group B, ...)
        const sortedGroupNames = Object.keys(groups).sort();

        // Sort matches within groups by date
        sortedGroupNames.forEach(groupName => {
            groups[groupName].sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
        });

        return sortedGroupNames.map(groupName => ({
            name: groupName,
            matches: groups[groupName]
        }));
    }, [matches]);

    return (
        <div className="space-y-10 sm:space-y-12">
            {groupedMatches.map((group) => (
                <div key={group.name} className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest border-b border-white/10 pb-3 sm:pb-4 mb-6 sm:mb-8">
                        {translateGroup(group.name)}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.matches.map((match) => (
                            <div key={match.id} className="glass-card rounded-xl sm:rounded-2xl p-3 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1">
                                <div className="flex justify-between items-center mb-2 sm:mb-3 text-[9px] sm:text-[10px] text-fifa-gray-light font-bold tracking-wider uppercase opacity-70">
                                    <span>{new Date(match.utcDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                    <span className={`px-2 py-0.5 rounded-full border text-[8px] ${match.status === 'SCHEDULED' || match.status === 'TIMED' ? 'bg-white/5 border-white/20 text-white/60' :
                                        match.status === 'IN_PLAY' ? 'bg-fifa-green/20 border-fifa-green text-fifa-green animate-pulse' :
                                            match.status === 'PAUSED' ? 'bg-fifa-cyan/20 border-fifa-cyan text-fifa-cyan' :
                                                match.status === 'FINISHED' ? 'bg-fifa-blue/20 border-fifa-blue text-fifa-blue' :
                                                    match.status === 'POSTPONED' || match.status === 'SUSPENDED' ? 'bg-fifa-red/20 border-fifa-red text-fifa-red' :
                                                        'bg-white/5 border-white/20 text-white/60'
                                        }`}>
                                        {translateStatus(match.status)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-3 relative">
                                    {/* Team 1 */}
                                    <div className="flex flex-col items-center flex-1">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                            {match.homeTeam.crest ? (
                                                <Image src={match.homeTeam.crest} alt={translateTeam(match.homeTeam.name)} fill className="object-contain drop-shadow-2xl" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mb-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-white font-black text-center text-[10px] sm:text-[11px] uppercase tracking-wide leading-tight h-7 flex items-center px-1">{translateTeam(match.homeTeam.name)}</span>
                                    </div>

                                    {/* VS */}
                                    <div className="flex flex-col items-center px-2">
                                        <span className="text-base sm:text-lg text-fifa-gray-light font-black tracking-tight opacity-40">VS</span>
                                    </div>

                                    {/* Team 2 */}
                                    <div className="flex flex-col items-center flex-1">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                            {match.awayTeam.crest ? (
                                                <Image src={match.awayTeam.crest} alt={translateTeam(match.awayTeam.name)} fill className="object-contain drop-shadow-2xl" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:h-10 mb-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-white font-black text-center text-[10px] sm:text-[11px] uppercase tracking-wide leading-tight h-7 flex items-center px-1">{translateTeam(match.awayTeam.name)}</span>
                                    </div>
                                </div>

                                {/* Live Score Display for IN_PLAY matches */}
                                {match.status === 'IN_PLAY' && match.score.fullTime.home !== null && match.score.fullTime.away !== null && (
                                    <div className="mb-2 sm:mb-3 p-2 bg-fifa-green/10 border border-fifa-green/30 rounded-xl">
                                        <div className="text-center">
                                            <div className="text-[8px] sm:text-[9px] text-fifa-green font-bold tracking-wider uppercase mb-1 animate-pulse">
                                                🔴 EN VIVO
                                            </div>
                                            <div className="flex justify-center items-center gap-2">
                                                <span className="text-lg sm:text-xl font-black text-white">
                                                    {match.score.fullTime.home}
                                                </span>
                                                <span className="text-fifa-gray-light font-black text-sm">-</span>
                                                <span className="text-lg sm:text-xl font-black text-white">
                                                    {match.score.fullTime.away}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center items-center gap-3 mb-3 group-hover:scale-105 transition-transform duration-500">
                                    <input
                                        type="number"
                                        min="0"
                                        disabled={savedMatches.has(match.id)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 text-center text-base sm:text-lg font-black rounded-lg text-white border outline-none transition-all shadow-xl p-0 appearance-none m-0 leading-none flex items-center justify-center touch-target ${savedMatches.has(match.id)
                                            ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                                            : 'bg-fifa-black/60 border-white/10 focus:border-fifa-green focus:ring-1 focus:ring-fifa-green placeholder-white/5'
                                            }`}
                                        value={predictions[match.id]?.home ?? ''}
                                        onChange={(e) => handlePredictionChange(match.id, 'home', e.target.value)}
                                    />
                                    <span className="text-white/10 font-black text-lg tracking-tighter">:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        disabled={savedMatches.has(match.id)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 text-center text-base sm:text-lg font-black rounded-lg text-white border outline-none transition-all shadow-xl p-0 appearance-none m-0 leading-none flex items-center justify-center touch-target ${savedMatches.has(match.id)
                                            ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                                            : 'bg-fifa-black/60 border-white/10 focus:border-fifa-blue focus:ring-1 focus:ring-fifa-blue placeholder-white/5'
                                            }`}
                                        value={predictions[match.id]?.away ?? ''}
                                        onChange={(e) => handlePredictionChange(match.id, 'away', e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => savePrediction(match.id)}
                                    disabled={loading === match.id.toString() || savedMatches.has(match.id)}
                                    className={`fifa-button w-full py-2 sm:py-2.5 rounded-lg font-black text-[8px] sm:text-[9px] tracking-[0.1em] uppercase shadow-2xl transition-all duration-500 touch-target ${savedMatches.has(match.id)
                                        ? 'bg-fifa-green/10 text-fifa-green cursor-not-allowed border border-fifa-green/30'
                                        : 'bg-white text-black hover:bg-fifa-black hover:text-white border border-transparent hover:border-white/20'
                                        } disabled:opacity-50`}
                                >
                                    {loading === match.id.toString() ? '...' : savedMatches.has(match.id) ? '✓ GUARDADO' : messages[match.id] || 'GUARDAR PRONÓSTICO'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
