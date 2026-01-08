'use client'

import { useLanguage } from '@/app/context/LanguageContext'
import { Users, Video, DollarSign, Activity } from 'lucide-react'

export default function AdminDashboard() {
    const { t } = useLanguage()

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t.admin.welcome}</h1>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 font-medium">Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-indigo-500" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium mb-1">{t.admin.users}</div>
                    <div className="text-3xl font-bold text-white">1,245</div>
                    <div className="text-emerald-400 text-xs mt-2 flex items-center">
                        +12% vs yesterday
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Video className="w-16 h-16 text-rose-500" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium mb-1">{t.admin.video}</div>
                    <div className="text-3xl font-bold text-white">850</div>
                    <div className="text-rose-400 text-xs mt-2">
                        Watching Keynote
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 h-16 text-amber-500" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium mb-1">{t.admin.sponsors} (Total)</div>
                    <div className="text-3xl font-bold text-white">3,402</div>
                    <div className="text-amber-400 text-xs mt-2">
                        Interactions
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-cyan-500" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium mb-1">{t.admin.analytics} Load</div>
                    <div className="text-3xl font-bold text-white">12%</div>
                    <div className="text-cyan-400 text-xs mt-2">
                        45ms Latency
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">{t.admin.quickStats}</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                            <span className="font-medium">📢 Send Push Notification</span>
                            <span className="text-xs bg-indigo-600 px-2 py-1 rounded">Push</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                            <span className="font-medium">🛑 Pause Streaming</span>
                            <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">Emergency</span>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Activity Log</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                            <div>
                                <p className="text-sm font-medium text-slate-200">New registration: user@example.com</p>
                                <p className="text-xs text-slate-500">2 mins ago</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2" />
                            <div>
                                <p className="text-sm font-medium text-slate-200">Stream Started</p>
                                <p className="text-xs text-slate-500">1 hour ago</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
