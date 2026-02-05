'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import LobbyHud from './LobbyHud'
import QuickNavModal from './QuickNavModal'
import FloorPlanModal from './FloorPlanModal'
import AgendaModal from './AgendaModal'
import ProfileModal from './ProfileModal'
import ChatModal from './ChatModal'
import { useLanguage } from '../context/LanguageContext'
import NavigationInstructions from '../components/NavigationInstructions'

// Dynamically import Experience with a premium loading state
const Experience = dynamic(() => import('./LobbyScene'), {
    ssr: false,
    loading: () => (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '2rem', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '0.4em', textTransform: 'uppercase', animation: 'loading-pulse 2s infinite' }}>
                EVENTOS <span style={{ opacity: 0.4 }}>VIRTUALES PRO</span>
            </div>
            <div style={{ width: '200px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#06b6d4', animation: 'loading-bar 2s ease-in-out infinite' }} />
            </div>
            <style jsx>{`
                @keyframes loading-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            `}</style>
        </div>
    )
})

export default function LobbyClientWrapper({ userEmail, profile, signOutAction, rooms, sponsors }: any) {
    const { t } = useLanguage()
    const [isQuickNavOpen, setIsQuickNavOpen] = useState(false)
    const [isFloorPlanOpen, setIsFloorPlanOpen] = useState(false)
    const [isAgendaOpen, setIsAgendaOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)

    return (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: '#020617', overflow: 'hidden' }}>

            {/* --- 3D SCENE (Background Layer) --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Experience sponsors={sponsors} />
            </div>

            {/* --- UI HUD (Overlays) --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <LobbyHud
                    onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
                    onOpenQuickNav={() => setIsQuickNavOpen(true)}
                    onOpenAgenda={() => setIsAgendaOpen(true)}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onOpenChat={() => setIsChatOpen(true)}
                    onSignOut={signOutAction}
                />
            </div>

            {/* --- MODALS --- */}
            <QuickNavModal
                isOpen={isQuickNavOpen}
                onClose={() => setIsQuickNavOpen(false)}
            />

            <FloorPlanModal
                isOpen={isFloorPlanOpen}
                onClose={() => setIsFloorPlanOpen(false)}
            />

            <AgendaModal
                isOpen={isAgendaOpen}
                onClose={() => setIsAgendaOpen(false)}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userProfile={profile}
            />

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />

            {/* --- INSTRUCTIONS POPUP --- */}
            <NavigationInstructions />

        </div>
    )
}
