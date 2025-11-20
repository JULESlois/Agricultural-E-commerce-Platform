import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import VerticalNav from './VerticalNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-bg">
      <TopBar />
      <div className="flex">
        <VerticalNav />
        <main className="flex-1 ml-16 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
