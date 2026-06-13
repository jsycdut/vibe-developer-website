import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/admin/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
