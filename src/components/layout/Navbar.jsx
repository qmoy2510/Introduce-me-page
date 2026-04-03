import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import LogoutButton from '../auth/LogoutButton'

const links = [
  { to: '/', label: 'About' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/study', label: 'Study' },
  { to: '/board', label: 'Board' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-surface">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-accent font-bold text-lg tracking-tight">
          &lt;Dev /&gt;
        </Link>
        <div className="flex items-center gap-8">
          <ul className="flex gap-8">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative text-sm font-medium transition-colors hover:text-accent pb-1 ${
                    pathname === to ? 'text-accent' : 'text-text-sub'
                  }`}
                >
                  {label}
                  {pathname === to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <LogoutButton />
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-text-sub hover:text-accent transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
