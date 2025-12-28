import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveQuizAnswers } from '../utils/localStorage'

const Quiz = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    budget: '',
    dietary: '',
    skill: '',
    time: '',
    cuisine: ''
  })

  const questions = [
    {
      id: 'budget',
      question: "What's your weekly food budget?",
      options: [
        { value: 'low', label: '< 400 DKK - Living on ramen' },
        { value: 'medium', label: '400-600 DKK - Standard student budget' },
        { value: 'high', label: '600+ DKK - Comfortable' }
      ]
    },
    {
      id: 'dietary',
      question: 'Any dietary restrictions?',
      options: [
        { value: 'none', label: 'None - I eat everything' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' }
      ]
    },
    {
      id: 'skill',
      question: 'How good are you at cooking?',
      options: [
        { value: 'beginner', label: 'Beginner - I can boil water' },
        { value: 'intermediate', label: 'Intermediate - I can follow recipes' },
        { value: 'advanced', label: 'Advanced - I actually enjoy cooking' }
      ]
    },
    {
      id: 'time',
      question: 'How much time can you spend cooking?',
      options: [
        { value: 'quick', label: 'Quick - 15-20 min max' },
        { value: 'normal', label: 'Normal - 20-35 min is fine' },
        { value: 'relaxed', label: 'Relaxed - I have time to cook properly' }
      ]
    },
    {
      id: 'cuisine',
      question: 'Favorite type of food?',
      options: [
        { value: 'any', label: 'Any - Just feed me' },
        { value: 'Italian', label: 'Italian - Pasta all day' },
        { value: 'American', label: 'American - Classic comfort food' },
        { value: 'Indian', label: 'Indian - Spicy and flavorful' },
        { value: 'Chinese', label: 'Chinese - Quick stir-fries' }
      ]
    }
  ]

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSelect = (value) => {
    setAnswers({
      ...answers,
      [currentQ.id]: value
    })
  }

  const handleNext = () => {
    if (!answers[currentQ.id]) {
      alert('Please select an option')
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz complete - save and navigate
      saveQuizAnswers(answers)
      navigate('/results')
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <main className="quiz-container">
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="quiz-question">
          <h2 className="question-title">{currentQ.question}</h2>
          
          <div className="quiz-options">
            {currentQ.options.map((option) => (
              <div 
                key={option.value}
                className={`quiz-option ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option.value}
                  checked={answers[currentQ.id] === option.value}
                  onChange={() => {}}
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-nav">
          {currentQuestion > 0 && (
            <button onClick={handleBack} className="btn btn-secondary">
              Back
            </button>
          )}
          <button 
            onClick={handleNext} 
            className="btn btn-primary"
            style={{ marginLeft: currentQuestion === 0 ? 'auto' : '0' }}
          >
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default Quiz
