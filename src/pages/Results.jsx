import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchRecipesByPreferences } from '../utils/api'
import { getTopMatches } from '../utils/matchingAlgorithm'
import { getQuizAnswers, clearQuizAnswers } from '../utils/localStorage'
import RecipeCard from '../components/RecipeCard'

const Results = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    const quizAnswers = getQuizAnswers()
    
    if (!quizAnswers) {
      navigate('/quiz')
      return
    }

    try {
      setLoading(true)
      
      const recipes = await fetchRecipesByPreferences(quizAnswers)
      
      if (recipes.length === 0) {
        setError('No recipes found. Try different preferences.')
        setLoading(false)
        return
      }
      
      const scoredRecipes = getTopMatches(recipes, quizAnswers, 8)
      setMatches(scoredRecipes)
      
    } catch (err) {
      console.error('Error loading results:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetakeQuiz = () => {
    clearQuizAnswers()
    navigate('/quiz')
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="loading-spinner"></div>
        <h2>Finding your perfect recipes...</h2>
        <p>Searching through hundreds of recipes</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>{error}</h2>
        <button onClick={handleRetakeQuiz} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      </main>
    )
  }

  return (
    <main>
      <div className="results-header">
        <div className="container">
          <div className="results-badge">🎯 Your Matches</div>
          <h1>We Found {matches.length} Recipes For You</h1>
          <p>Budget-friendly recipes that match your preferences</p>
          <button onClick={handleRetakeQuiz} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Change Preferences
          </button>
        </div>
      </div>

      <div className="container">
        <div className="recipe-grid">
          {matches.map((recipe, index) => (
            <div key={recipe.id}>
              {index < 3 && (
                <div style={{ marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
                  {index === 0 && '🥇 Best Match'}
                  {index === 1 && '🥈 Great Choice'}
                  {index === 2 && '🥉 Also Perfect'}
                </div>
              )}
              <RecipeCard recipe={recipe} showMatch={true} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', background: 'white', borderRadius: '16px', textAlign: 'center' }}>
          <h3>Want to save recipes?</h3>
          <p style={{ marginBottom: '1.5rem' }}>Click the save button on any recipe to add it to your collection</p>
          <Link to="/saved" className="btn btn-primary">View Saved Recipes</Link>
        </div>
      </div>
    </main>
  )
}

export default Results
