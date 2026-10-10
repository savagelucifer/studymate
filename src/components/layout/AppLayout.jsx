import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NotificationManager from './NotificationManager'

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-midnight text-slate-900 dark:text-slate-100 overflow-hidden">
      <NotificationManager />
      <div className="w-64 shrink-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
