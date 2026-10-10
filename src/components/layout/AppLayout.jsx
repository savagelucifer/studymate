import React from 'react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NotificationManager from './NotificationManager'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-midnight text-slate-900 dark:text-slate-100 overflow-hidden">
      <NotificationManager />
      <div className="w-64 shrink-0 hidden md:block">
        <Sidebar />
      </div>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
