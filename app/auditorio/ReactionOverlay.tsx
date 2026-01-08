'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ThumbsUp, PartyPopper, Flame, Smile } from 'lucide-react'

// Reaction Types
type ReactionType = 'heart' | 'like' | 'party' | 'fire' | 'laugh'

interface ReactionEvent {
    id: string
    type: ReactionType
    x: number // Random X position for variety
}

const REACTIONS: { type: ReactionType; icon: any; color: string }[] = [
    { type: 'heart', icon: Heart, color: 'text-red-500 fill-red-500' },
    { type: 'like', icon: ThumbsUp, color: 'text-blue-500 fill-blue-500' },
    { type: 'party', icon: PartyPopper, color: 'text-yellow-500' },
    { type: 'fire', icon: Flame, color: 'text-orange-500 fill-orange-500' },
    { type: 'laugh', icon: Smile, color: 'text-emerald-400' },
]

export default function ReactionOverlay({ roomId }: { roomId: string }) {
    const [reactions, setReactions] = useState<ReactionEvent[]>([])
    const supabase = createClient()

    // 1. Subscribe to Realtime Broadcast
    useEffect(() => {
        const channel = supabase.channel(`reactions_${roomId}`)
            .on(
                'broadcast',
                { event: 'emote' },
                (payload) => {
                    addReactionLocal(payload.payload.type)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, supabase])

    // 2. Add Reaction (Local + Broadcast)
    const sendReaction = async (type: ReactionType) => {
        // Show immediately locally
        addReactionLocal(type)

        // Broadcast to others
        await supabase.channel(`reactions_${roomId}`).send({
            type: 'broadcast',
            event: 'emote',
            payload: { type }
        })
    }

    // 3. Helper to add floating emoji
    const addReactionLocal = useCallback((type: ReactionType) => {
        const id = Math.random().toString(36).substring(7)
        const x = Math.random() * 80 + 10 // Random width 10% - 90%

        setReactions(prev => [...prev, { id, type, x }])

        // Auto remove after animation
        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id))
        }, 2000)
    }, [])

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Floating Area */}
            <AnimatePresence>
                {reactions.map((r) => {
                    const reactionConfig = REACTIONS.find(def => def.type === r.type)
                    const Icon = reactionConfig?.icon || Heart

                    return (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 100, scale: 0.5 }}
                            animate={{ opacity: [0, 1, 1, 0], y: -400, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className={`absolute bottom-20 ${reactionConfig?.color}`}
                            style={{ left: `${r.x}%` }}
                        >
                            <Icon className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg" />
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            {/* Reaction Buttons (Bottom Right) */}
            <div className="absolute bottom-6 right-6 md:right-20 flex flex-col-reverse gap-3 pointer-events-auto">
                <div className="bg-black/60 backdrop-blur-md p-2 rounded-full flex flex-col gap-2 border border-white/10 shadow-xl">
                    {REACTIONS.map((r) => (
                        <button
                            key={r.type}
                            onClick={() => sendReaction(r.type)}
                            className="p-2 hover:bg-white/20 rounded-full transition-transform active:scale-75 group"
                        >
                            <r.icon className={`w-6 h-6 ${r.color} opacity-80 group-hover:opacity-100`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
