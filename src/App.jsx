import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Planner from './pages/Planner'
import Subjects from './pages/Subjects'
import FocusTimer from './pages/FocusTimer'
import ProgressAnalytics from './pages/ProgressAnalytics'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'

function ProtectedRoute({ children }) {
  const { settings } = useAppContext()
  if (settings.isFirstLaunch) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="planner" element={<Planner />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="timer" element={<FocusTimer />} />
          <Route path="analytics" element={<ProgressAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
