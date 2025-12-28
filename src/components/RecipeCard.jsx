import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { saveRecipe, removeSavedRecipe, isRecipeSaved } from '../utils/localStorage'

const RecipeCard = ({ recipe, showMatch = false, onRemove = null }) => {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.id))
  }, [recipe.id])

  const handleSaveToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (saved) {
      removeSavedRecipe(recipe.id)
      setSaved(false)
      if (onRemove) onRemove(recipe.id)
    } else {
      saveRecipe(recipe)
      setSaved(true)
    }
  }

  return (
    <div className="card recipe-card">
      <div style={{ position: 'relative' }}>
        <img 
          src={recipe.image}
          alt={recipe.name}
          className="recipe-image"
          loading="lazy"
        />
        
        {showMatch && recipe.matchScore && (
          <div className="recipe-match">
            {recipe.matchScore}% Match
          </div>
        )}
      </div>

      <h3 className="recipe-title">{recipe.name}</h3>

      <div className="recipe-info">
        <div className="recipe-info-item">
          <span>💰</span>
          <span>~{recipe.estimatedCost || 35} DKK</span>
        </div>
        <div className="recipe-info-item">
          <span>⏱️</span>
          <span>{recipe.estimatedTime || 25} min</span>
        </div>
        <div className="recipe-info-item">
          <span>👨‍🍳</span>
          <span>{recipe.difficulty || 'Medium'}</span>
        </div>
      </div>

      <div className="recipe-badges">
        {recipe.category && (
          <span className="badge">{recipe.category}</span>
        )}
        {recipe.area && (
          <span className="badge" style={{ background: 'var(--text-gray)' }}>
            {recipe.area}
          </span>
        )}
      </div>

      {showMatch && recipe.matchReasons && recipe.matchReasons.length > 0 && (
        <div style={{ 
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: 'var(--text-gray)',
          lineHeight: '1.6'
        }}>
          {recipe.matchReasons.map((reason, idx) => (
            <div key={idx} style={{ marginBottom: '0.25rem' }}>
              ✓ {reason}
            </div>
          ))}
        </div>
      )}

      <div className="recipe-actions">
        <Link 
          to={`/recipe/${recipe.id}`}
          className="btn btn-secondary"
        >
          View Recipe
        </Link>
        
        <button
          onClick={handleSaveToggle}
          className={saved ? 'btn btn-accent' : 'btn btn-primary'}
        >
          {saved ? '❤️ Saved' : '🤍 Save'}
        </button>
      </div>
    </div>
  )
}

export default RecipeCard
