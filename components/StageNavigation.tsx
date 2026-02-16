'use client';

import { STAGE_LABELS } from '@/lib/stages';

interface StageNavigationProps {
    availableStages: string[];
    currentStage: string;
    onStageChange: (stage: string) => void;
}

export default function StageNavigation({ availableStages, currentStage, onStageChange }: StageNavigationProps) {
    return (
        <div className="mb-8 w-full">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scroll-x-smooth pb-2 px-4 sm:px-0 sm:justify-center -mx-4 sm:mx-0">
                {availableStages.map((stage) => (
                    <button
                        key={stage}
                        onClick={() => onStageChange(stage)}
                        className={`flex-shrink-0 px-5 sm:px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-300 touch-target ${currentStage === stage
                            ? 'bg-white/10 text-white border-2 border-white shadow-xl shadow-fifa-blue/10 scale-105'
                            : 'bg-white/[0.02] text-fifa-gray-light hover:bg-white/5 border border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
                            }`}
                    >
                        {STAGE_LABELS[stage] || stage}
                    </button>
                ))}
            </div>
        </div>
    );
}
