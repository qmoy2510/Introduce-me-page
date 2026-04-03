import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/study" replace />

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <LoginForm />
    </main>
  )
}
