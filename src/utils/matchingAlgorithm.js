// Student Recipe Matching Algorithm
// Scores recipes based on budget, time, skill level, and preferences

// Estimate recipe cost based on ingredients (Danish pricing)
const estimateRecipeCost = (recipe) => {
  const ingredientCount = recipe.ingredients.length
  
  // Simple estimation: fewer ingredients = cheaper
  // Average student recipe cost: 25-60 DKK per serving
  if (ingredientCount <= 5) return 25
  if (ingredientCount <= 8) return 35
  if (ingredientCount <= 12) return 45
  return 55
}

// Estimate cooking time based on instructions
const estimateCookingTime = (recipe) => {
  const instructionCount = recipe.instructions.length
  const hasComplexWords = recipe.instructions.some(step => 
    step.toLowerCase().includes('marinate') || 
    step.toLowerCase().includes('refrigerate') ||
    step.toLowerCase().includes('rest')
  )
  
  // Basic estimation
  if (instructionCount <= 4 && !hasComplexWords) return 15
  if (instructionCount <= 7) return 25
  if (instructionCount <= 10) return 35
  return 45
}

// Determine difficulty based on ingredients and instructions
const estimateDifficulty = (recipe) => {
  const ingredientCount = recipe.ingredients.length
  const instructionCount = recipe.instructions.length
  
  const complexTerms = [
    'fold', 'sauté', 'reduce', 'deglaze', 'blanch', 
    'zest', 'julienne', 'dice finely', 'temper'
  ]
  
  const hasComplexTechniques = recipe.instructions.some(step => 
    complexTerms.some(term => step.toLowerCase().includes(term))
  )
  
  if (ingredientCount <= 6 && instructionCount <= 5 && !hasComplexTechniques) {
    return 'Easy'
  } else if (ingredientCount <= 10 && instructionCount <= 8) {
    return 'Medium'
  } else {
    return 'Advanced'
  }
}

// Main matching algorithm
export const calculateRecipeMatch = (recipe, quizAnswers) => {
  let score = 0
  const reasons = []
  
  // Add estimated values to recipe
  recipe.estimatedCost = estimateRecipeCost(recipe)
  recipe.estimatedTime = estimateCookingTime(recipe)
  recipe.difficulty = estimateDifficulty(recipe)
  
  // 1. BUDGET MATCHING (30 points)
  const budgetMap = {
    'low': [0, 35],      // < 35 DKK
    'medium': [30, 50],  // 30-50 DKK
    'high': [45, 100]    // 45+ DKK
  }
  
  const [minBudget, maxBudget] = budgetMap[quizAnswers.budget]
  if (recipe.estimatedCost >= minBudget && recipe.estimatedCost <= maxBudget) {
    score += 30
    reasons.push(`${recipe.estimatedCost}kr fits your budget`)
  } else if (Math.abs(recipe.estimatedCost - minBudget) <= 10) {
    score += 15
  }
  
  // 2. TIME MATCHING (25 points)
  const timeMap = {
    'quick': [0, 20],     // < 20 min
    'normal': [20, 35],   // 20-35 min
    'relaxed': [30, 60]   // 30-60 min
  }
  
  const [minTime, maxTime] = timeMap[quizAnswers.time]
  if (recipe.estimatedTime >= minTime && recipe.estimatedTime <= maxTime) {
    score += 25
    reasons.push(`${recipe.estimatedTime} min cooking time`)
  } else if (Math.abs(recipe.estimatedTime - minTime) <= 10) {
    score += 12
  }
  
  // 3. SKILL LEVEL MATCHING (25 points)
  const skillMap = {
    'beginner': ['Easy'],
    'intermediate': ['Easy', 'Medium'],
    'advanced': ['Medium', 'Advanced']
  }
  
  if (skillMap[quizAnswers.skill].includes(recipe.difficulty)) {
    score += 25
    reasons.push(`${recipe.difficulty} difficulty for ${quizAnswers.skill}s`)
  } else if (
    (quizAnswers.skill === 'intermediate' && recipe.difficulty === 'Advanced') ||
    (quizAnswers.skill === 'beginner' && recipe.difficulty === 'Medium')
  ) {
    score += 12
  }
  
  // 4. DIETARY MATCH (10 points)
  if (quizAnswers.dietary === 'vegetarian' && 
      (recipe.category === 'Vegetarian' || !hasMeat(recipe))) {
    score += 10
    reasons.push('Vegetarian-friendly')
  } else if (quizAnswers.dietary === 'vegan' && recipe.category === 'Vegan') {
    score += 10
    reasons.push('Vegan')
  } else if (quizAnswers.dietary === 'none') {
    score += 5
  }
  
  // 5. CUISINE MATCH (10 points)
  if (quizAnswers.cuisine !== 'any' && 
      recipe.area.toLowerCase() === quizAnswers.cuisine.toLowerCase()) {
    score += 10
    reasons.push(`${recipe.area} cuisine`)
  } else if (quizAnswers.cuisine === 'any') {
    score += 5
  }
  
  // Calculate percentage (max 100 points)
  const percentage = Math.min(Math.round(score), 100)
  
  return {
    ...recipe,
    matchScore: percentage,
    matchReasons: reasons.slice(0, 3) // Top 3 reasons
  }
}

// Helper function to detect meat in ingredients
const hasMeat = (recipe) => {
  const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'tuna']
  return recipe.ingredients.some(ing => 
    meatKeywords.some(meat => ing.name.toLowerCase().includes(meat))
  )
}

// Get top matches from recipe list
export const getTopMatches = (recipes, quizAnswers, limit = 8) => {
  // Score all recipes
  const scoredRecipes = recipes.map(recipe => 
    calculateRecipeMatch(recipe, quizAnswers)
  )
  
  // Sort by match score (highest first)
  const sorted = scoredRecipes.sort((a, b) => b.matchScore - a.matchScore)
  
  // Return top matches
  return sorted.slice(0, limit)
}
