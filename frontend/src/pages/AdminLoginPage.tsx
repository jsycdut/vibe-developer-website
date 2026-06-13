import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) return
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role === 'CHATTER') navigate('/admin/chat')
      else navigate('/admin/notes')
    } catch {
      setError('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white sm:bg-[#f8fafc] flex flex-col justify-center px-6 sm:items-center">
      <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:border sm:border-slate-900/10 sm:shadow-[4px_4px_0px_0px_#0f172a] sm:p-8">
        <h2 className="font-bold text-slate-900 text-2xl mb-2">后台登录</h2>
        <p className="text-sm text-slate-500 mb-6">jsy.log 管理系统</p>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 active:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>
    </div>
  )
}
