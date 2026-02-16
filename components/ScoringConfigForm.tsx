'use client';

import { useState } from 'react';
import { updateScoringRule } from '@/app/admin/actions';

interface ScoringRule {
    id: string;
    description: string;
    points: number;
    category: string;
}

interface ScoringConfigFormProps {
    initialRules: ScoringRule[];
}

export default function ScoringConfigForm({ initialRules }: ScoringConfigFormProps) {
    const [rules, setRules] = useState(initialRules);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handlePointsChange = (id: string, newPoints: string) => {
        const points = parseInt(newPoints) || 0;
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, points } : rule
        ));
    };

    const handleSave = async (id: string, points: number) => {
        setSaving(true);
        setMessage('');

        const result = await updateScoringRule(id, points);

        if (result.success) {
            setMessage('✓ Guardado exitosamente');
            setTimeout(() => setMessage(''), 2000);
        } else {
            setMessage('✗ Error al guardar');
        }

        setSaving(false);
    };

    const groupRules = rules.filter(r => r.category === 'GROUP');
    const bracketRules = rules.filter(r => r.category === 'BRACKET');

    return (
        <div className="space-y-8">
            {message && (
                <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-lg text-white shadow-xl">
                    {message}
                </div>
            )}

            {/* Group Stage Rules */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-white mb-6">Fase de Grupos</h2>
                <div className="space-y-4">
                    {groupRules.map(rule => (
                        <div key={rule.id} className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-white font-medium">{rule.description}</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={rule.points}
                                    onChange={(e) => handlePointsChange(rule.id, e.target.value)}
                                    className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-fifa-cyan"
                                />
                                <button
                                    onClick={() => handleSave(rule.id, rule.points)}
                                    disabled={saving}
                                    className="px-4 py-2 bg-white hover:bg-white/90 text-fifa-black font-bold rounded-lg transition-all disabled:opacity-50"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bracket Rules */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-white mb-6">Fase Final (Bracket)</h2>
                <div className="space-y-4">
                    {bracketRules.map(rule => (
                        <div key={rule.id} className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-white font-medium">{rule.description}</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={rule.points}
                                    onChange={(e) => handlePointsChange(rule.id, e.target.value)}
                                    className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-fifa-cyan"
                                />
                                <button
                                    onClick={() => handleSave(rule.id, rule.points)}
                                    disabled={saving}
                                    className="px-4 py-2 bg-white hover:bg-white/90 text-fifa-black font-bold rounded-lg transition-all disabled:opacity-50"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
