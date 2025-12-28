import { Link, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const location = useLocation()

  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
      >
        🏠 Home
      </Link>
      <Link 
        to="/saved" 
        className={`nav-btn ${location.pathname === '/saved' ? 'active' : ''}`}
      >
        ❤️ Saved
      </Link>
    </nav>
  )
}

export default BottomNav
