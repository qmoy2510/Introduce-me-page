import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import BoardPage from './pages/BoardPage'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/board" element={<BoardPage />} />
      </Routes>
    </HashRouter>
  )
}
