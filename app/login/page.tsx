import { login, signup } from './actions'
import { ArrowLeft, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl relative z-10">
                <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Inicio
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
                        Bienvenido
                    </h1>
                    <p className="text-slate-400">Ingresa tus credenciales para acceder al evento.</p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="usuario@ejemplo.com"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" htmlFor="password">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button formAction={login} className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20">
                            Iniciar Sesión
                        </button>
                        <button formAction={signup} className="w-full py-2.5 rounded-lg bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium transition-all">
                            Registrarse
                        </button>
                    </div>

                    {searchParams?.message && (
                        <p className="mt-4 p-3 bg-red-900/30 border border-red-900/50 rounded-lg text-sm text-red-200 text-center">
                            {searchParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
