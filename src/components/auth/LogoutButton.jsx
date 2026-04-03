import { supabase } from '../../libs/supabaseClient'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-text-sub hover:text-accent transition-colors"
    >
      로그아웃
    </button>
  )
}
