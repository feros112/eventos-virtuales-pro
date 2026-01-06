'use client'

import { X, MousePointer, Hand, Move, Maximize, Scroll, GripHorizontal } from 'lucide-react'

export default function InstructionsOverlay({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-sm p-6 overflow-y-auto">

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">HOW TO NAVIGATE</h2>
                    <p className="text-slate-400 text-lg">Master the controls to explore the virtual space.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">

                    {/* Divider for Desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                    {/* --- MOBILE CONTROLS --- */}
                    <div className="space-y-12">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest mb-2">Touch Devices</h3>
                            <p className="text-xs font-mono text-slate-500">SMARTPHONE / TABLET</p>
                        </div>

                        <div className="grid gap-8">
                            {/* Drag to Look */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <Hand className="w-10 h-10 text-cyan-400 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Look Around</h4>
                                    <p className="text-slate-400 text-sm">Touch and drag your finger across the screen to rotate your view.</p>
                                </div>
                            </div>

                            {/* Move */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <GripHorizontal className="w-10 h-10 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Move Around</h4>
                                    <p className="text-slate-400 text-sm">Tap on the floor squares or specific points of interest to walk there.</p>
                                </div>
                            </div>

                            {/* Zoom */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <Maximize className="w-10 h-10 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Zoom In/Out</h4>
                                    <p className="text-slate-400 text-sm">Pinch with two fingers to zoom in or zoom out of the view.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- PC CONTROLS --- */}
                    <div className="space-y-12">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-indigo-400 uppercase tracking-widest mb-2">Desktop</h3>
                            <p className="text-xs font-mono text-slate-500">MOUSE & KEYBOARD</p>
                        </div>

                        <div className="grid gap-8">
                            {/* Drag to Look */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <MousePointer className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Look Around</h4>
                                    <p className="text-slate-400 text-sm">Click and drag with your mouse left or right to rotate the camera.</p>
                                </div>
                            </div>

                            {/* Move */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <Move className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Move Around</h4>
                                    <p className="text-slate-400 text-sm">Click on the floor markers to navigate to different areas.</p>
                                </div>
                            </div>

                            {/* Zoom */}
                            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                                    <Scroll className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Zoom In/Out</h4>
                                    <p className="text-slate-400 text-sm">Use your mouse scroll wheel to zoom in and out.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={onClose}
                        className="px-12 py-4 bg-white text-black font-black text-lg uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        Enter Experience
                    </button>
                    <p className="mt-4 text-xs text-slate-500 animate-pulse">Click anywhere to close</p>
                </div>
            </div>
        </div>
    )
}
