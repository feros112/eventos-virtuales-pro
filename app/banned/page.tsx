
import { AlertOctagon, Mail } from 'lucide-react'
import Link from 'next/link'

export default function BannedPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-red-900/30 flex items-center justify-center mb-6 animate-bounce">
                <AlertOctagon className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-red-500">Acceso Restringido</h1>

            <p className="text-xl text-slate-300 max-w-lg mb-8">
                Tu cuenta ha sido suspendida temporalmente por violar los términos de servicio de la comunidad.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">¿Crees que es un error?</h3>
                <p className="text-sm text-slate-500 mb-4">Contacta inmediatamente con el equipo de soporte para revisar tu caso.</p>

                <a href="mailto:soporte@proevents.com" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors">
                    <Mail className="w-4 h-4" /> Contactar Soporte
                </a>
            </div>

            <p className="text-xs text-slate-600">ID de Referencia: #BANNED_USER_ACTION</p>
        </div>
    )
}
