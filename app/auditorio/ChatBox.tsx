'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { Send, ThumbsUp, MessageCircle, HelpCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// Define Message type
type Message = {
    id: number
    content: string
    user_email: string
    created_at: string
}

export default function ChatBox({ userEmail }: { userEmail: string }) {
    const supabase = createClient()
    const { t } = useLanguage()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [activeTab, setActiveTab] = useState<'chat' | 'qa'>('chat')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const getMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(50)

            if (data) setMessages(data)
        }

        getMessages()

        const channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        await supabase.from('messages').insert({
            content: newMessage,
            user_email: userEmail
        })

        setNewMessage('')
    }

    return (
        <div className="flex flex-col h-full bg-slate-950/20 text-white backdrop-blur-[40px]">
            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-black/40 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'chat'
                        ? 'text-cyan-400 bg-cyan-400/5 shadow-[inset_0_-2px_0_0_#22d3ee]'
                        : 'text-white/40 hover:text-white/60'
                        }`}
                >
                    <MessageCircle className="w-4 h-4" />
                    {t.auditorium.chatTitle}
                </button>
                <button
                    onClick={() => setActiveTab('qa')}
                    className={`flex-1 py-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'qa'
                        ? 'text-cyan-400 bg-cyan-400/5 shadow-[inset_0_-2px_0_0_#22d3ee]'
                        : 'text-white/40 hover:text-white/60'
                        }`}
                >
                    <HelpCircle className="w-4 h-4" />
                    Q&A
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* Welcome Message */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-4 text-[11px] text-cyan-200/60 leading-relaxed text-center font-bold tracking-wide shadow-2xl">
                    {t.auditorium.chatWelcome.toUpperCase()}
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-[10px] font-black text-cyan-400 flex-shrink-0 uppercase shadow-xl group-hover:border-cyan-500/50 transition-all group-hover:scale-105">
                            {msg.user_email.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-[11px] font-black text-white/90 truncate mr-2 tracking-widest uppercase">
                                    {msg.user_email.split('@')[0]}
                                </span>
                                <span className="text-[9px] text-white/30 font-bold tracking-tighter">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 shadow-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300">
                                <p className="text-sm text-white/80 break-words leading-relaxed font-semibold">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-3xl flex-shrink-0">
                <form onSubmit={handleSendMessage} className="relative group">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t.auditorium.chatPlaceholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none shadow-inner group-hover:bg-white/10"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-cyan-500 rounded-xl hover:bg-cyan-400 text-black transition-all disabled:opacity-20 disabled:grayscale shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-90"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="flex justify-between items-center mt-4 px-1">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                        {t.auditorium.chatConnected}
                    </span>
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest italic opacity-50">
                        IWEBOLUTIONS ENGINE v4.0
                    </span>
                </div>
            </div>
        </div>
    )
}
