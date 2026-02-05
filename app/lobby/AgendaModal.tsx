'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface Session {
    id: string;
    category: string;
    title: string;
    location: string;
    time: string;
    date: string;
}

const MOCK_SESSIONS: Session[] = [
    { id: '1', category: 'Break one', title: 'Marketing 101', location: 'Theater 1', date: 'MAY 21', time: '3:30pm' },
    { id: '2', category: 'Break two', title: 'Coding Features', location: 'Theater 2', date: 'MAY 20-21', time: '12:00pm' },
    { id: '3', category: 'Break one', title: 'About Activism', location: 'Theater 1', date: 'MAY 20-21', time: '9:00am' },
    { id: '4', category: 'Break two', title: 'Technology Advice', location: 'Theater 3', date: 'MAY 20-21', time: '3:00pm' },
    { id: '5', category: 'Break one', title: 'Virtual events 101', location: 'Theater 1', date: 'MAY 22', time: '4:00pm' },
]

interface AgendaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AgendaModal({ isOpen, onClose }: AgendaModalProps) {
    const [activeTab, setActiveTab] = useState<'full' | 'my'>('full');
    const [myAgenda, setMyAgenda] = useState<string[]>(['2', '3']); // ids of sessions in my agenda

    if (!isOpen) return null;

    const toggleSession = (id: string) => {
        if (myAgenda.includes(id)) {
            setMyAgenda(myAgenda.filter(sid => sid !== id));
        } else {
            setMyAgenda([...myAgenda, id]);
        }
    }

    const sessionsToDisplay = activeTab === 'full'
        ? MOCK_SESSIONS
        : MOCK_SESSIONS.filter(s => myAgenda.includes(s.id));

    return (
        <div style={{
            position: 'absolute',
            top: '90px',
            right: '40px',
            width: '420px',
            zIndex: 7000,
            pointerEvents: 'auto',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Close Button Inside Modal */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 20,
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.3rem',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    <X size={24} color="#000" strokeWidth={3} />
                </button>

                {/* Tabs */}
                <div style={{ display: 'flex', height: '70px' }}>
                    <button
                        onClick={() => setActiveTab('full')}
                        style={{
                            flex: 1,
                            backgroundColor: activeTab === 'full' ? '#06b6d4' : '#0e7490',
                            color: 'white',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            letterSpacing: '0.05em'
                        }}
                    >
                        FULL AGENDA
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        style={{
                            flex: 1,
                            backgroundColor: activeTab === 'my' ? '#4c1d95' : '#2e1065',
                            color: 'white',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            letterSpacing: '0.05em'
                        }}
                    >
                        MY AGENDA
                    </button>
                </div>

                {/* Session List */}
                <div style={{
                    maxHeight: '500px',
                    overflowY: 'auto',
                    backgroundColor: '#f3f4f6'
                }}>
                    {sessionsToDisplay.length > 0 ? (
                        sessionsToDisplay.map((session, index) => (
                            <div key={session.id} style={{
                                padding: '1.5rem',
                                borderBottom: index !== sessionsToDisplay.length - 1 ? '1px solid #e5e7eb' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: activeTab === 'full' && myAgenda.includes(session.id) ? '#ecfeff' : 'white'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#312e81' }}>{session.category}</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b' }}>{session.title}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{session.location}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563' }}>{session.date}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{session.time}</span>
                                    </div>

                                    <button
                                        onClick={() => toggleSession(session.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: myAgenda.includes(session.id) ? '#ef4444' : '#06b6d4',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            cursor: 'pointer',
                                            padding: '0.4rem 0.6rem',
                                            borderRadius: '0.4rem',
                                            backgroundColor: 'rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        {myAgenda.includes(session.id) ? (
                                            <>
                                                <div style={{ width: '14px', height: '14px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
                                                REMOVE
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ width: '14px', height: '14px', backgroundColor: '#06b6d4', borderRadius: '2px' }} />
                                                ADD
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280', fontWeight: 600 }}>
                            {activeTab === 'full' ? 'No sessions available.' : 'Your agenda is empty. Add some sessions!'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
