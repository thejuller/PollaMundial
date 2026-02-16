'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Team } from '@/lib/api';
import { submitBracketPrediction } from '@/app/actions';
import { translateTeam } from '@/lib/translations';

interface BracketPredictionProps {
    userId: string;
    stage: string;
    position: number;
    availableTeams: Team[];
    initialPrediction?: {
        homeTeamId: number | null;
        awayTeamId: number | null;
        homeTeamName: string | null;
        awayTeamName: string | null;
        homeScore: number | null;
        awayScore: number | null;
    };
}

export default function BracketPredictionCard({
    userId,
    stage,
    position,
    availableTeams,
    initialPrediction,
}: BracketPredictionProps) {
    const [homeTeamId, setHomeTeamId] = useState<number | null>(initialPrediction?.homeTeamId || null);
    const [awayTeamId, setAwayTeamId] = useState<number | null>(initialPrediction?.awayTeamId || null);
    const [homeScore, setHomeScore] = useState<number | null>(initialPrediction?.homeScore || null);
    const [awayScore, setAwayScore] = useState<number | null>(initialPrediction?.awayScore || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSaved, setIsSaved] = useState(!!(initialPrediction?.homeTeamId && initialPrediction?.awayTeamId));

    const homeTeam = availableTeams.find(t => t.id === homeTeamId);
    const awayTeam = availableTeams.find(t => t.id === awayTeamId);

    const handleSave = async () => {
        if (!homeTeamId || !awayTeamId) {
            setMessage('Selecciona ambos equipos');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        setLoading(true);
        try {
            await submitBracketPrediction(
                userId,
                stage,
                position,
                homeTeamId,
                awayTeamId,
                homeTeam?.name || null,
                awayTeam?.name || null,
                homeScore,
                awayScore
            );
            setIsSaved(true);
            setMessage('¡Guardado!');
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            console.error(error);
            setMessage('¡Error!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 hover:border-white/20 transition-all duration-500 group">
            {/* Position Badge */}
            <div className="flex justify-between items-center mb-4 sm:mb-5">
                <span className="text-fifa-gray-dark text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] opacity-50">
                    Eliminatoria
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/5 bg-white/5 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest">
                    Partido #{position}
                </span>
            </div>

            {/* Team Selectors */}
            <div className="flex justify-between items-center mb-5 sm:mb-6 gap-2 sm:gap-4">
                {/* Home Team */}
                <div className="flex-1 space-y-2 sm:space-y-2.5">
                    <div className="relative">
                        <select
                            value={homeTeamId || ''}
                            onChange={(e) => !isSaved && setHomeTeamId(parseInt(e.target.value))}
                            disabled={isSaved}
                            className={`w-full px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-wider uppercase transition-all appearance-none cursor-pointer touch-target ${isSaved
                                ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                                : 'bg-fifa-black/60 border-white/5 hover:border-white/20 focus:border-fifa-green text-white outline-none'
                                } border`}
                        >
                            <option value="">EQUIPO 1</option>
                            {availableTeams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {translateTeam(team.name)}
                                </option>
                            ))}
                        </select>
                        {!isSaved && (
                            <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-white text-[10px]">
                                ▽
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-[50px] sm:min-h-[60px] bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-2.5 transition-all duration-500 group-hover:border-fifa-green/20">
                        {homeTeam ? (
                            <>
                                <div className="w-7 h-7 sm:w-10 sm:h-10 relative mb-1.5 drop-shadow-2xl">
                                    <Image src={homeTeam.crest} alt={translateTeam(homeTeam.name)} fill className="object-contain" />
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-black text-fifa-gray-light text-center uppercase tracking-wider px-0.5">{translateTeam(homeTeam.name)}</span>
                            </>
                        ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-dashed border-white/10 flex items-center justify-center opacity-20">
                                <span className="text-sm sm:text-base font-thin">+</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-base text-fifa-gray-dark font-black italic opacity-20 tracking-tighter">VS</span>
                </div>

                {/* Away Team */}
                <div className="flex-1 space-y-2 sm:space-y-2.5">
                    <div className="relative">
                        <select
                            value={awayTeamId || ''}
                            onChange={(e) => !isSaved && setAwayTeamId(parseInt(e.target.value))}
                            disabled={isSaved}
                            className={`w-full px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-wider uppercase transition-all appearance-none cursor-pointer touch-target ${isSaved
                                ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                                : 'bg-fifa-black/60 border-white/5 hover:border-white/20 focus:border-fifa-blue text-white outline-none'
                                } border`}
                        >
                            <option value="">EQUIPO 2</option>
                            {availableTeams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {translateTeam(team.name)}
                                </option>
                            ))}
                        </select>
                        {!isSaved && (
                            <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-white text-[10px]">
                                ▽
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-[50px] sm:min-h-[60px] bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/5 p-2 sm:p-2.5 transition-all duration-500 group-hover:border-fifa-blue/20">
                        {awayTeam ? (
                            <>
                                <div className="w-7 h-7 sm:w-10 sm:h-10 relative mb-1.5 drop-shadow-2xl">
                                    <Image src={awayTeam.crest} alt={translateTeam(awayTeam.name)} fill className="object-contain" />
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-black text-fifa-gray-light text-center uppercase tracking-wider px-0.5">{translateTeam(awayTeam.name)}</span>
                            </>
                        ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-dashed border-white/10 flex items-center justify-center opacity-20">
                                <span className="text-sm sm:text-base font-thin">+</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Score Inputs */}
            {homeTeamId && awayTeamId && (
                <div className="flex justify-center items-center gap-2.5 sm:gap-4 mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-500">
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        disabled={isSaved}
                        className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-black rounded-xl sm:rounded-2xl text-white border outline-none transition-all shadow-xl p-0 appearance-none m-0 leading-none flex items-center justify-center touch-target ${isSaved
                            ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                            : 'bg-fifa-black/60 border-white/10 focus:border-fifa-green focus:ring-1 focus:ring-fifa-green placeholder-white/5'
                            }`}
                        value={homeScore ?? ''}
                        onChange={(e) => setHomeScore(parseInt(e.target.value) || null)}
                    />
                    <span className="text-white/10 font-black text-lg sm:text-xl tracking-tighter opacity-50">:</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        disabled={isSaved}
                        className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-black rounded-xl sm:rounded-2xl text-white border outline-none transition-all shadow-xl p-0 appearance-none m-0 leading-none flex items-center justify-center touch-target ${isSaved
                            ? 'bg-fifa-black/40 border-fifa-gray-dark cursor-not-allowed opacity-50'
                            : 'bg-fifa-black/60 border-white/10 focus:border-fifa-blue focus:ring-1 focus:ring-fifa-blue placeholder-white/5'
                            }`}
                        value={awayScore ?? ''}
                        onChange={(e) => setAwayScore(parseInt(e.target.value) || null)}
                    />
                </div>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={loading || isSaved || !homeTeamId || !awayTeamId}
                className={`fifa-button w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-[8px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.15em] uppercase shadow-2xl transition-all duration-500 touch-target ${isSaved
                    ? 'bg-fifa-green/10 text-fifa-green cursor-not-allowed border border-fifa-green/30'
                    : 'bg-white text-black hover:bg-fifa-black hover:text-white border border-transparent hover:border-white/20'
                    } disabled:opacity-50`}
            >
                {loading ? '...' : isSaved ? '✓ GUARDADO' : message || 'GUARDAR PRONÓSTICO'}
            </button>
        </div>
    );
}
