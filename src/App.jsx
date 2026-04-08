import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import BoardPage from './pages/BoardPage'
import StudyLogPage from './pages/StudyLogPage'
import LoginPage from './pages/LoginPage'
import StockDashboardPage from './pages/StockDashboardPage'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/study" element={<StudyLogPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/stock" element={<StockDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
