import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <main className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">👨‍🍳</div>
        
        <h1 className="welcome-heading">Student Recipe Matcher</h1>
        
        <p className="welcome-text">
          Broke student? Don't know what to cook? Answer 5 quick questions 
          and get budget-friendly recipes that actually fit your life.
        </p>
        
        <Link to="/quiz" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
          Find My Recipes
        </Link>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
          Takes less than 1 minute
        </p>
      </div>
    </main>
  )
}

export default Home
