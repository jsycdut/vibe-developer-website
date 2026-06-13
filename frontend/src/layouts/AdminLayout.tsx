import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, FileText, MessageSquare, LogOut, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/admin/notes', label: '笔记管理', icon: FileText, roles: ['EDITOR', 'ADMIN'] },
  { to: '/admin/chat', label: '聊天室', icon: MessageSquare, roles: ['CHATTER', 'ADMIN'] },
  { to: '/admin/users', label: '用户管理', icon: Users, roles: ['ADMIN'] },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-white border-r border-slate-900/10">
      <div className="h-16 flex items-center px-6 border-b border-slate-900/10">
        <span className="font-bold text-slate-900">后台管理</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-900/10">
        <div className="text-xs text-slate-500 mb-2">{user?.username} · {user?.role}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-500 transition-colors"
        >
          <LogOut size={14} /> 退出登录
        </button>
      </div>
    </div>
  )

  return (
    <div className="h-[100dvh] bg-[#f8fafc] flex flex-col">
      {/* 手机端顶部栏 */}
      <div className="md:hidden h-14 bg-white border-b border-slate-900/10 flex items-center px-4 gap-3 sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-100 rounded-lg">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="font-bold text-slate-900">后台管理</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PC 端固定侧边栏 */}
        <aside className="hidden md:block w-52 shrink-0 h-[calc(100vh-0px)] sticky top-0">
          <Sidebar />
        </aside>

        {/* 手机端抽屉 */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="w-52 h-full"><Sidebar /></div>
            <div className="flex-1 bg-black/20" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* 右侧工作区 */}
        <main className="flex-1 flex flex-col overflow-auto md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
