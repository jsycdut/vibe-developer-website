import { useState, useEffect } from 'react'
import { Trash2, KeyRound, Plus, X } from 'lucide-react'
import api from '../lib/api'

interface User {
  id: string
  username: string
  role: string
}

const ROLES = ['ADMIN', 'EDITOR', 'CHATTER']

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [pwdTarget, setPwdTarget] = useState<User | null>(null)

  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('EDITOR')

  const [newPwd, setNewPwd] = useState('')
  const [msg, setMsg] = useState('')

  const fetchUsers = () => api.get('/users').then((r) => setUsers(r.data))

  useEffect(() => { fetchUsers() }, [])

  const flash = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 2500)
  }

  const handleAdd = async () => {
    if (!newUsername.trim() || !newPassword.trim()) return
    try {
      await api.post('/users', { username: newUsername.trim(), password: newPassword, role: newRole })
      setShowAdd(false)
      setNewUsername('')
      setNewPassword('')
      setNewRole('EDITOR')
      fetchUsers()
      flash('用户创建成功')
    } catch (e: any) {
      flash(e.response?.data?.message ?? '创建失败')
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`确定删除用户「${user.username}」？`)) return
    await api.delete(`/users/${user.id}`)
    fetchUsers()
    flash('已删除')
  }

  const handleChangePwd = async () => {
    if (!newPwd.trim() || !pwdTarget) return
    await api.put(`/users/${pwdTarget.id}/password`, { newPassword: newPwd })
    setPwdTarget(null)
    setNewPwd('')
    flash('密码修改成功')
  }

  const roleColor: Record<string, string> = {
    ADMIN: 'bg-red-50 text-red-600',
    EDITOR: 'bg-blue-50 text-blue-600',
    CHATTER: 'bg-green-50 text-green-600',
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">用户管理</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={15} /> 新增用户
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
          {msg}
        </div>
      )}

      {/* 新增用户表单 */}
      {showAdd && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-slate-800 text-sm">新增用户</span>
            <button onClick={() => setShowAdd(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="用户名"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="password"
              placeholder="密码"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              onClick={handleAdd}
              className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              确认创建
            </button>
          </div>
        </div>
      )}

      {/* 用户列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {users.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-10">暂无用户</p>
        )}
        {users.map((user, idx) => (
          <div
            key={user.id}
            className={`flex items-center px-4 py-3 gap-3 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm truncate">{user.username}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColor[user.role] ?? 'bg-slate-100 text-slate-500'}`}>
              {user.role}
            </span>
            <button
              onClick={() => { setPwdTarget(user); setNewPwd('') }}
              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="修改密码"
            >
              <KeyRound size={16} />
            </button>
            <button
              onClick={() => handleDelete(user)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除用户"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* 修改密码弹层 */}
      {pwdTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-slate-900">修改密码</span>
              <button onClick={() => setPwdTarget(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-3">用户：<span className="font-medium text-slate-800">{pwdTarget.username}</span></p>
            <input
              type="password"
              placeholder="新密码"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChangePwd()}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleChangePwd}
              className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              确认修改
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
