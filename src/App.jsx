import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import RecipeDetail from './pages/RecipeDetail'
import SavedRecipes from './pages/SavedRecipes'
import BottomNav from './components/BottomNav'

function AppContent() {
  const location = useLocation()
  const hideNav = location.pathname === '/quiz'

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/saved" element={<SavedRecipes />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
