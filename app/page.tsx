import { loginUser } from './actions';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full glass-card border-gradient-trionda rounded-[2rem] p-6 sm:p-10 shadow-2xl">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-2">
            Polla<span className="text-white">26</span>
          </h1>
          <p className="text-fifa-gray-light font-medium tracking-wide opacity-80 text-xs sm:text-sm">
            EL JUEGO DE PREDICCIONES OFICIAL
          </p>
        </div>

        <form action={loginUser} className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-bold text-fifa-gray-light tracking-widest uppercase ml-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-fifa-green focus:ring-1 focus:ring-fifa-green outline-none transition-all placeholder-white/20 text-white font-semibold touch-target"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-bold text-fifa-gray-light tracking-widest uppercase ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-fifa-blue focus:ring-1 focus:ring-fifa-blue outline-none transition-all placeholder-white/20 text-white font-semibold touch-target"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            className="fifa-button fifa-button-primary w-full py-5 rounded-2xl font-black text-base sm:text-lg tracking-widest uppercase shadow-xl hover:shadow-fifa-white/10 touch-target"
          >
            ENTRAR AHORA
          </button>
        </form>
      </div>

      <p className="mt-8 sm:mt-12 text-fifa-gray-dark text-xs font-bold tracking-[0.3em] uppercase opacity-50">
        Copa Mundial 2026 - Norteamérica
      </p>
    </div>
  );
}
