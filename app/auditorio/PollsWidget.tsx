'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, CheckCircle, XCircle, Plus } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface Poll {
    id: string
    question: string
    options: string[]
    votes: number[] // Count per option
    totalVotes: number
    hasVoted: boolean
}

interface PollsWidgetProps {
    roomId: string
    isAdmin?: boolean // Check if user is admin/moderator
    userId: string
}

export default function PollsWidget({ roomId, isAdmin = false, userId }: PollsWidgetProps) {
    const [activePoll, setActivePoll] = useState<Poll | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [newQuestion, setNewQuestion] = useState('')
    const [newOptions, setNewOptions] = useState<string[]>(['', ''])
    const { t } = useLanguage()
    const supabase = createClient()

    // 1. Listen for Poll Events
    useEffect(() => {
        // Initial Fetch
        const fetchActivePoll = async () => {
            const { data } = await supabase
                .from('interaction_events')
                .select('*')
                .eq('type', 'poll_active')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (data) {
                // Fetch votes for this poll
                const { count } = await supabase
                    .from('interaction_events')
                    .select('*', { count: 'exact', head: true })
                    .eq('type', 'poll_vote')
                    .eq('payload->poll_id', data.id)
                    .eq('user_id', userId)

                // Calculate current results
                const { data: votesData } = await supabase
                    .from('interaction_events')
                    .select('payload')
                    .eq('type', 'poll_vote')
                    .eq('payload->poll_id', data.id)

                const options = data.payload.options as string[]
                const voteCounts = new Array(options.length).fill(0)

                votesData?.forEach((v: any) => {
                    const idx = v.payload.option_index
                    if (idx >= 0 && idx < voteCounts.length) voteCounts[idx]++
                })

                setActivePoll({
                    id: data.id,
                    question: data.payload.question,
                    options: options,
                    votes: voteCounts,
                    totalVotes: votesData?.length || 0,
                    hasVoted: (count || 0) > 0
                })
            } else {
                setActivePoll(null)
            }
        }

        fetchActivePoll()

        // Realtime Subscription
        const channel = supabase.channel(`polls_${roomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'interaction_events', filter: "type=eq.poll_active" },
                (payload) => {
                    if (payload.new.status === 'active') {
                        // New Poll Created
                        setActivePoll({
                            id: payload.new.id,
                            question: payload.new.payload.question,
                            options: payload.new.payload.options,
                            votes: new Array(payload.new.payload.options.length).fill(0),
                            totalVotes: 0,
                            hasVoted: false
                        })
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'interaction_events', filter: "type=eq.poll_active" },
                (payload) => {
                    if (payload.new.status === 'closed') {
                        setActivePoll(null)
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'interaction_events', filter: "type=eq.poll_vote" },
                (payload) => {
                    // Update Local State with new vote
                    if (activePoll && payload.new.payload.poll_id === activePoll.id) {
                        const idx = payload.new.payload.option_index
                        setActivePoll(prev => {
                            if (!prev) return null
                            const newVotes = [...prev.votes]
                            newVotes[idx]++
                            return { ...prev, votes: newVotes, totalVotes: prev.totalVotes + 1 }
                        })
                    }
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId, activePoll?.id, supabase, roomId])

    // 2. Cast Vote
    const handleVote = async (index: number) => {
        if (!activePoll || activePoll.hasVoted) return

        // Optimistic UI
        setActivePoll(prev => prev ? { ...prev, hasVoted: true } : null)

        await supabase.from('interaction_events').insert({
            user_id: userId,
            type: 'poll_vote',
            status: 'completed',
            payload: { poll_id: activePoll.id, option_index: index }
        })
    }

    // 3. Admin: Create Poll
    const handleCreatePoll = async (e: React.FormEvent) => {
        e.preventDefault()
        const validOptions = newOptions.filter(o => o.trim() !== '')
        if (!newQuestion || validOptions.length < 2) return

        setIsCreating(false)
        await supabase.from('interaction_events').insert({
            user_id: userId,
            type: 'poll_active',
            status: 'active',
            payload: { question: newQuestion, options: validOptions }
        })

        // Reset Form
        setNewQuestion('')
        setNewOptions(['', ''])
    }

    // 4. Admin: Close Poll
    const handleClosePoll = async () => {
        if (!activePoll) return
        await supabase.from('interaction_events')
            .update({ status: 'closed' })
            .eq('id', activePoll.id)
    }

    return (
        <div className="fixed bottom-24 right-4 md:right-8 z-40 flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence>
                {/* ACTIVE POLL CARD */}
                {activePoll && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-[90vw] md:w-80 pointer-events-auto"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-lg text-white leading-tight uppercase tracking-tighter italic shadow-sm">{activePoll.question}</h3>
                            {isAdmin && (
                                <button onClick={handleClosePoll} className="text-white/20 hover:text-red-500 transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {activePoll.options.map((option: string, idx: number) => {
                                const percentage = activePoll.totalVotes > 0
                                    ? Math.round((activePoll.votes[idx] / activePoll.totalVotes) * 100)
                                    : 0

                                return (
                                    <button
                                        key={idx}
                                        disabled={activePoll.hasVoted}
                                        onClick={() => handleVote(idx)}
                                        className={`w-full relative overflow-hidden rounded-xl transition-all border ${activePoll.hasVoted
                                            ? 'bg-white/5 border-white/5 cursor-default'
                                            : 'bg-white/10 hover:bg-white/20 border-white/10 hover:border-cyan-500/50 shadow-xl'
                                            } p-4 text-left group`}
                                    >
                                        {/* Progress Bar Background */}
                                        {activePoll.hasVoted && (
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="absolute inset-y-0 left-0 bg-cyan-500/20 z-0"
                                            />
                                        )}

                                        <div className="relative z-10 flex justify-between items-center">
                                            <span className={`text-sm font-bold uppercase tracking-widest ${activePoll.hasVoted ? 'text-white/70' : 'text-white group-hover:text-cyan-400'}`}>
                                                {option}
                                            </span>
                                            {activePoll.hasVoted && (
                                                <span className="text-xs font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{percentage}%</span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {activePoll.hasVoted && (
                            <div className="mt-4 flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <CheckCircle className="w-4 h-4 shadow-sm" /> {t.auditorium.poll.voted}
                                <span className="ml-auto text-white/20">{activePoll.totalVotes} VOTOS</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ADMIN CREATE BUTTON */}
                {isAdmin && !activePoll && !isCreating && (
                    <motion.button
                        layout
                        onClick={() => setIsCreating(true)}
                        className="bg-cyan-500 hover:bg-white text-black rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.4)] pointer-events-auto transition-all active:scale-95 group"
                    >
                        <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </motion.button>
                )}

                {/* CREATE POLL FORM */}
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] w-[90vw] md:w-80 pointer-events-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h4 className="font-black text-white uppercase tracking-widest text-sm">{t.auditorium.poll.create}</h4>
                            <button onClick={() => setIsCreating(false)}><XCircle className="w-5 h-5 text-white/20 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleCreatePoll} className="space-y-4">
                            <input
                                placeholder={t.auditorium.poll.question}
                                value={newQuestion}
                                onChange={e => setNewQuestion(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-cyan-500 outline-none"
                                required
                            />
                            {newOptions.map((opt, i) => (
                                <input
                                    key={i}
                                    placeholder={`${t.auditorium.poll.options} ${i + 1}`}
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...newOptions]
                                        newOpts[i] = e.target.value
                                        setNewOptions(newOpts)
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-cyan-500 outline-none"
                                    required
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setNewOptions([...newOptions, ''])}
                                className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Añadir Opción
                            </button>
                            <button type="submit" className="w-full bg-cyan-500 hover:bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                                {t.auditorium.poll.publish}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
