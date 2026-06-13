import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/notes', label: '笔记' },
  { to: '/portfolio', label: '作品集' },
  { to: '/about', label: '关于我' },
]

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="flex justify-between items-center h-16 px-8 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-900/10 z-50">
        <span className="font-bold text-slate-900 text-lg tracking-tight">jsy.log</span>
        <div className="flex gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 font-bold drop-shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
