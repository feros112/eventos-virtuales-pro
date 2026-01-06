'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen p-4">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Algo salió mal (Global)</h2>
                <pre className="bg-slate-900 p-4 rounded text-xs text-slate-300 mb-4 max-w-2xl overflow-auto">
                    {error.message}
                    {error.stack}
                </pre>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                    Intentar de nuevo
                </button>
            </body>
        </html>
    )
}
