
'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { Send, ThumbsUp } from 'lucide-react'

// Define Message type
type Message = {
    id: number
    content: string
    user_email: string
    created_at: string
}

export default function ChatBox({ userEmail }: { userEmail: string }) {
    const supabase = createClient()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        // 1. Fetch initial messages
        const getMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(50) // Load last 50 messages

            if (data) setMessages(data)
        }

        getMessages()

        // 2. Subscribe to new messages (Realtime Magic)
        const channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    // Add new message to list
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

        // Send to DB (Realtime triggers update automatically)
        await supabase.from('messages').insert({
            content: newMessage,
            user_email: userEmail
        })

        setNewMessage('')
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-white/10">
            {/* Tabs */}
            <div className="flex border-b border-white/5 flex-shrink-0">
                <button className="flex-1 py-4 text-sm font-bold border-b-2 border-indigo-500 text-white bg-white/5">
                    Chat en Vivo
                </button>
                <button className="flex-1 py-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    Q&A
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {/* System Message */}
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-3 text-xs text-indigo-200 text-center">
                    Bienvenidos al chat oficial. Recuerden mantener el respeto.
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Avatar (Initials) */}
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 uppercase shadow-sm">
                            {msg.user_email.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-0.5">
                                <span className="text-xs font-bold text-slate-300 truncate mr-2">
                                    {msg.user_email.split('@')[0]}
                                </span>
                                <span className="text-[10px] text-slate-600">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-slate-200 break-words leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-slate-950 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Participa en la conversación..."
                        className="w-full bg-slate-800 border border-slate-700/50 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="flex justify-between items-center mt-2 px-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Chat conectado
                    </span>
                </div>
            </div>
        </div>
    )
}
