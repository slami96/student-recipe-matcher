import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchRecipeDetails } from '../utils/api'
import { saveRecipe, removeSavedRecipe, isRecipeSaved } from '../utils/localStorage'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadRecipe()
  }, [id])

  const loadRecipe = async () => {
    try {
      setLoading(true)
      const data = await fetchRecipeDetails(id)
      
      if (!data) {
        alert('Recipe not found')
        navigate('/')
        return
      }
      
      setRecipe(data)
      setSaved(isRecipeSaved(id))
    } catch (error) {
      console.error('Error loading recipe:', error)
      alert('Error loading recipe')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = () => {
    if (saved) {
      removeSavedRecipe(recipe.id)
      setSaved(false)
    } else {
      saveRecipe(recipe)
      setSaved(true)
    }
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="loading-spinner"></div>
        <h2>Loading recipe...</h2>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
      </main>
    )
  }

  return (
    <main className="recipe-detail">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">← Back</button>
      </div>

      <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />

      <div className="recipe-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1>{recipe.name}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <span className="badge">{recipe.category}</span>
              <span className="badge" style={{ background: 'var(--text-gray)' }}>{recipe.area}</span>
            </div>
          </div>
          
          <button onClick={handleSaveToggle} className={saved ? 'btn btn-accent' : 'btn btn-primary'}>
            {saved ? '❤️ Saved' : '🤍 Save Recipe'}
          </button>
        </div>
      </div>

      <div className="card recipe-section">
        <h3>Recipe Info</h3>
        <div className="recipe-info" style={{ marginTop: '1rem' }}>
          <div className="recipe-info-item">
            <span>💰 Cost:</span>
            <span>{recipe.estimatedCost || '~35'} DKK per serving</span>
          </div>
          <div className="recipe-info-item">
            <span>⏱️ Time:</span>
            <span>{recipe.estimatedTime || '~25'} minutes</span>
          </div>
          <div className="recipe-info-item">
            <span>👨‍🍳 Level:</span>
            <span>{recipe.difficulty || 'Medium'}</span>
          </div>
          <div className="recipe-info-item">
            <span>🍽️ Servings:</span>
            <span>2-4 people</span>
          </div>
        </div>
      </div>

      <div className="card recipe-section">
        <h3>Ingredients</h3>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.measure && `${ing.measure} `}
              {ing.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="card recipe-section">
        <h3>Instructions</h3>
        <ol className="instruction-list">
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.video && (
        <div className="card recipe-section">
          <h3>Video Tutorial</h3>
          <a 
            href={recipe.video} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            📺 Watch on YouTube
          </a>
        </div>
      )}

      <div className="card recipe-section" style={{ background: 'var(--secondary)' }}>
        <h3>💡 Student Tips</h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <li>✓ Buy ingredients at Netto or Føtex for best prices</li>
          <li>✓ Can't find an ingredient? Google substitutes!</li>
          <li>✓ Double the recipe and save leftovers</li>
          <li>✓ Use the Nemlig app to compare grocery prices</li>
        </ul>
      </div>
    </main>
  )
}

export default RecipeDetail
