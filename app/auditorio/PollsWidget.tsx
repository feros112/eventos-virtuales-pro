'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, CheckCircle, XCircle, Plus, Trophy } from 'lucide-react'
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
    }, [userId, activePoll?.id]) // Re-subscribe if active poll changes context

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
                        className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 p-5 rounded-2xl shadow-2xl w-[90vw] md:w-80 pointer-events-auto"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-white leading-tight">{activePoll.question}</h3>
                            {isAdmin && (
                                <button onClick={handleClosePoll} className="text-slate-400 hover:text-red-400">
                                    <XCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {activePoll.options.map((option, idx) => {
                                const percentage = activePoll.totalVotes > 0
                                    ? Math.round((activePoll.votes[idx] / activePoll.totalVotes) * 100)
                                    : 0

                                return (
                                    <button
                                        key={idx}
                                        disabled={activePoll.hasVoted}
                                        onClick={() => handleVote(idx)}
                                        className={`w-full relative overflow-hidden rounded-lg transition-all ${activePoll.hasVoted
                                            ? 'bg-slate-800 cursor-default'
                                            : 'bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-500/30'
                                            } p-3 text-left`}
                                    >
                                        {/* Progress Bar Background */}
                                        {activePoll.hasVoted && (
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="absolute inset-y-0 left-0 bg-indigo-600/30 z-0"
                                            />
                                        )}

                                        <div className="relative z-10 flex justify-between items-center">
                                            <span className={`font-medium ${activePoll.hasVoted ? 'text-slate-300' : 'text-white'}`}>
                                                {option}
                                            </span>
                                            {activePoll.hasVoted && (
                                                <span className="text-xs font-bold text-indigo-300">{percentage}%</span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {activePoll.hasVoted && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <CheckCircle className="w-4 h-4" /> {t.auditorium.poll.voted}
                                <span className="ml-auto text-slate-500">{activePoll.totalVotes} votes</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ADMIN CREATE BUTTON */}
                {isAdmin && !activePoll && !isCreating && (
                    <motion.button
                        layout
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-4 shadow-lg pointer-events-auto border-2 border-indigo-400/20"
                    >
                        <BarChart3 className="w-6 h-6" />
                    </motion.button>
                )}

                {/* CREATE POLL FORM */}
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-slate-900 border border-slate-700 p-4 rounded-xl w-[90vw] md:w-80 pointer-events-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-indigo-400">{t.auditorium.poll.create}</h4>
                            <button onClick={() => setIsCreating(false)}><XCircle className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleCreatePoll} className="space-y-3">
                            <input
                                placeholder={t.auditorium.poll.question}
                                value={newQuestion}
                                onChange={e => setNewQuestion(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
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
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
                                    required
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setNewOptions([...newOptions, ''])}
                                className="text-xs text-indigo-400 flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add Option
                            </button>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-sm">
                                {t.auditorium.poll.publish}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
