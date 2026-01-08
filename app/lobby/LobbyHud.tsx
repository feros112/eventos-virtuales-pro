'use client'

import React from 'react'
import { LogOut, User, Calendar, MessageCircle, Map, Compass } from 'lucide-react'
import Image from 'next/image'

interface LobbyHudProps {
    userEmail?: string
    onSignOut: () => void
    onOpenChat: () => void
    onOpenMap: () => void
    onOpenQuickNav: () => void
}

export default function LobbyHud({ userEmail, onSignOut, onOpenChat, onOpenMap, onOpenQuickNav }: LobbyHudProps) {
    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-50">
            {/* --- TOP BAR --- */}
            <header className="bg-white/95 backdrop-blur-sm h-16 px-6 flex items-center justify-between border-b border-slate-200 shadow-sm pointer-events-auto">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tighter text-indigo-600">
                        BEYOND<span className="text-slate-900 font-light">LIVE</span>
                    </h1>
                </div>

                {/* Right Navigation */}
                <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                    <button className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Agenda
                    </button>
                    <button className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                        onClick={onSignOut}
                        className="hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </nav>
            </header>

            {/* --- CENTER AREA (Transparent for 3D) --- */}
            <div className="flex-1 relative">
                {/* Optional: Add minimal overlays here if needed (e.g. notifications) */}
            </div>

            {/* --- BOTTOM BAR --- */}
            <footer className="bg-white/95 backdrop-blur-sm h-16 px-6 flex items-center justify-between border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pointer-events-auto">
                {/* Left Actions */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onOpenQuickNav}
                        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors group"
                    >
                        <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Compass className="w-5 h-5" />
                        </div>
                        Quick Nav
                    </button>
                    <button
                        onClick={onOpenMap}
                        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors group"
                    >
                        <div className="bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Map className="w-5 h-5" />
                        </div>
                        Floor Plan
                    </button>
                </div>

                {/* Center Branding */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold text-slate-800 tracking-widest uppercase opacity-80">
                        ProGlobal<span className="text-indigo-600">Events</span>
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onOpenChat}
                        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors"
                    >
                        Chat <MessageCircle className="w-5 h-5 text-indigo-600" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
