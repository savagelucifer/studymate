import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NotificationManager from './NotificationManager'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#f7f7fc] text-slate-900 dark:bg-[#080b16] dark:text-slate-100">
      <div className="pointer-events-none fixed -left-32 top-20 h-80 w-80 rounded-full bg-violet-300/15 blur-[100px] dark:bg-violet-700/10" />
      <div className="pointer-events-none fixed bottom-[-10rem] right-[-5rem] h-96 w-96 rounded-full bg-indigo-300/15 blur-[120px] dark:bg-indigo-700/10" />
      <NotificationManager />
      <div className="relative z-10 hidden w-64 shrink-0 md:block">
        <Sidebar />
      </div>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}
      <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
