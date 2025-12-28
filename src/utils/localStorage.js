// Local Storage utilities for saved recipes

const STORAGE_KEY = 'savedRecipes'

// Get all saved recipes
export const getSavedRecipes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading saved recipes:', error)
    return []
  }
}

// Save a recipe
export const saveRecipe = (recipe) => {
  try {
    const saved = getSavedRecipes()
    
    // Check if already saved
    if (saved.some(r => r.id === recipe.id)) {
      return false
    }
    
    saved.push(recipe)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    return true
  } catch (error) {
    console.error('Error saving recipe:', error)
    return false
  }
}

// Remove a saved recipe
export const removeSavedRecipe = (recipeId) => {
  try {
    const saved = getSavedRecipes()
    const filtered = saved.filter(r => r.id !== recipeId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error removing recipe:', error)
    return false
  }
}

// Check if recipe is saved
export const isRecipeSaved = (recipeId) => {
  const saved = getSavedRecipes()
  return saved.some(r => r.id === recipeId)
}

// Clear all saved recipes
export const clearAllSavedRecipes = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing recipes:', error)
    return false
  }
}

// Save quiz answers
export const saveQuizAnswers = (answers) => {
  try {
    localStorage.setItem('quizAnswers', JSON.stringify(answers))
  } catch (error) {
    console.error('Error saving quiz answers:', error)
  }
}

// Get quiz answers
export const getQuizAnswers = () => {
  try {
    const answers = localStorage.getItem('quizAnswers')
    return answers ? JSON.parse(answers) : null
  } catch (error) {
    console.error('Error loading quiz answers:', error)
    return null
  }
}

// Clear quiz answers
export const clearQuizAnswers = () => {
  try {
    localStorage.removeItem('quizAnswers')
  } catch (error) {
    console.error('Error clearing quiz answers:', error)
  }
}
