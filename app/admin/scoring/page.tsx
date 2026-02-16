import { getScoringRules } from '../actions';
import ScoringConfigForm from '@/components/ScoringConfigForm';
import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminScoringPage() {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-12 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
                    <h1 className="text-3xl font-black text-white mb-4">🔒 Acceso Denegado</h1>
                    <p className="text-fifa-gray-light mb-6">
                        No tienes permisos de administrador para acceder a esta página.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-4 rounded-2xl glass-card text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase touch-target"
                    >
                        VOLVER
                    </Link>
                </div>
            </div>
        );
    }

    const result = await getScoringRules();

    if (!result.success) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8">Error</h1>
                    <p className="text-white">{result.error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 sm:mb-12 md:mb-16 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
                            CONFIGURACIÓN DE <span className="text-white">PUNTUACIÓN</span>
                        </h1>
                        <p className="text-fifa-gray-light font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-40 text-[10px] sm:text-xs">
                            Ajusta los puntos para cada tipo de acierto
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

                <ScoringConfigForm initialRules={result.rules || []} />
            </div>
        </div>
    );
}
