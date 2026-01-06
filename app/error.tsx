'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Page Error:', error)
    }, [error])

    return (
        <div className="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Algo salió mal</h2>
            <pre className="bg-slate-900 p-4 rounded text-xs text-slate-300 mb-4 max-w-2xl overflow-auto">
                {error.message}
            </pre>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
                Intentar de nuevo
            </button>
        </div>
    )
}
