import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer.jsx'
import { AppHeader } from './AppHeader.jsx'
import { Sidebar } from './Sidebar.jsx'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:py-10">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
