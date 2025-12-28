// TheMealDB API integration
const API_BASE = 'https://www.themealdb.com/api/json/v1/1'

// Fetch recipes based on quiz preferences
export const fetchRecipesByPreferences = async (preferences) => {
  try {
    const { dietary, cuisine, skill } = preferences
    
    let endpoint = ''
    
    // Priority: dietary restrictions first
    if (dietary === 'vegetarian') {
      endpoint = `${API_BASE}/filter.php?c=Vegetarian`
    } else if (dietary === 'vegan') {
      endpoint = `${API_BASE}/filter.php?c=Vegan`
    } else if (cuisine && cuisine !== 'any') {
      // Filter by cuisine
      endpoint = `${API_BASE}/filter.php?a=${cuisine}`
    } else {
      // Get random selection if no specific filters
      endpoint = `${API_BASE}/search.php?s=`
    }
    
    const response = await fetch(endpoint)
    const data = await response.json()
    
    if (!data.meals) {
      // If no results, get random meals
      return await getRandomRecipes(10)
    }
    
    // Fetch full details for each recipe (API only returns basic info in filter)
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 15).map(meal => fetchRecipeDetails(meal.idMeal))
    )
    
    return detailedRecipes.filter(recipe => recipe !== null)
    
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

// Fetch full recipe details by ID
export const fetchRecipeDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${id}`)
    const data = await response.json()
    
    if (data.meals && data.meals.length > 0) {
      return formatRecipe(data.meals[0])
    }
    return null
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    return null
  }
}

// Get random recipes
const getRandomRecipes = async (count = 10) => {
  try {
    const recipes = []
    for (let i = 0; i < count; i++) {
      const response = await fetch(`${API_BASE}/random.php`)
      const data = await response.json()
      if (data.meals && data.meals.length > 0) {
        recipes.push(formatRecipe(data.meals[0]))
      }
    }
    return recipes
  } catch (error) {
    console.error('Error fetching random recipes:', error)
    return []
  }
}

// Format recipe data from API
const formatRecipe = (meal) => {
  // Extract ingredients and measurements
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      })
    }
  }
  
  // Split instructions into steps
  const instructions = meal.strInstructions
    ? meal.strInstructions
        .split(/\r?\n/)
        .filter(step => step.trim() && step.length > 10)
        .map(step => step.trim())
    : []
  
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || 'Other',
    area: meal.strArea || 'International',
    image: meal.strMealThumb,
    instructions: instructions,
    ingredients: ingredients,
    tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
    video: meal.strYoutube || null,
    // These will be calculated by the matching algorithm
    estimatedCost: null,
    estimatedTime: null,
    difficulty: null
  }
}

// Search recipes by name
export const searchRecipesByName = async (searchTerm) => {
  try {
    const response = await fetch(`${API_BASE}/search.php?s=${searchTerm}`)
    const data = await response.json()
    
    if (data.meals) {
      return data.meals.map(meal => formatRecipe(meal))
    }
    return []
  } catch (error) {
    console.error('Error searching recipes:', error)
    return []
  }
}
