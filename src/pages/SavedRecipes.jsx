import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSavedRecipes, clearAllSavedRecipes } from '../utils/localStorage'
import RecipeCard from '../components/RecipeCard'

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([])

  useEffect(() => {
    loadSavedRecipes()
  }, [])

  const loadSavedRecipes = () => {
    const recipes = getSavedRecipes()
    setSavedRecipes(recipes)
  }

  const handleRemove = (recipeId) => {
    const updated = savedRecipes.filter(r => r.id !== recipeId)
    setSavedRecipes(updated)
  }

  const handleClearAll = () => {
    if (window.confirm('Remove all saved recipes?')) {
      clearAllSavedRecipes()
      setSavedRecipes([])
    }
  }

  return (
    <main className="saved-recipes">
      <div className="container">
        <div className="saved-header">
          <div>
            <h1>My Saved Recipes</h1>
            <p style={{ color: 'var(--text-gray)' }}>
              {savedRecipes.length === 0 
                ? 'No recipes saved yet' 
                : `${savedRecipes.length} recipe${savedRecipes.length > 1 ? 's' : ''} saved`
              }
            </p>
          </div>
          
          {savedRecipes.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-secondary">Clear All</button>
          )}
        </div>

        {savedRecipes.length > 0 ? (
          <div className="recipe-grid">
            {savedRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onRemove={handleRemove} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2>No Saved Recipes</h2>
            <p>Find recipes that match your budget and save your favorites here!</p>
            <Link to="/quiz" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Find Recipes</Link>
          </div>
        )}

        {savedRecipes.length > 0 && (
          <div className="card" style={{ marginTop: '3rem', background: 'var(--secondary)' }}>
            <h3>💡 Meal Planning Tips</h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <li>✓ Cook multiple recipes on Sunday for the week</li>
              <li>✓ Freeze leftovers in portions</li>
              <li>✓ Write a shopping list before going to the store</li>
              <li>✓ Buy ingredients that work for multiple recipes</li>
              <li>✓ Start with 2-3 recipes and expand slowly</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}

export default SavedRecipes
