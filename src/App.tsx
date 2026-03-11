import { useState } from 'react'
import { Book, MessageCircle, Award, Home, Volume2, ChevronRight, Send, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const vocabulary = {
  greetings: [
    { en: 'Hello', tr: 'Merhaba', example: 'Hello, how are you?' },
    { en: 'Goodbye', tr: 'Hosca kal', example: 'Goodbye, see you tomorrow!' },
    { en: 'Thank you', tr: 'Tesekkur ederim', example: 'Thank you very much!' },
    { en: 'Please', tr: 'Lutfen', example: 'Please help me.' },
    { en: 'Yes', tr: 'Evet', example: 'Yes, I understand.' },
    { en: 'No', tr: 'Hayir', example: 'No, thank you.' },
  ],
  numbers: [
    { en: 'One', tr: 'Bir', example: 'I have one book.' },
    { en: 'Two', tr: 'Iki', example: 'Two plus two is four.' },
    { en: 'Three', tr: 'Uc', example: 'Three cats are playing.' },
    { en: 'Five', tr: 'Bes', example: 'Five fingers on my hand.' },
  ],
  colors: [
    { en: 'Red', tr: 'Kirmizi', example: 'The apple is red.' },
    { en: 'Blue', tr: 'Mavi', example: 'The sky is blue.' },
    { en: 'Green', tr: 'Yesil', example: 'Grass is green.' },
  ],
  family: [
    { en: 'Mother', tr: 'Anne', example: 'My mother is kind.' },
    { en: 'Father', tr: 'Baba', example: 'My father works hard.' },
  ],
}

const categories = [
  { id: 'greetings', name: 'Selamlasma', icon: '👋', color: '#FF6B6B' },
  { id: 'numbers', name: 'Sayilar', icon: '🔢', color: '#4ECDC4' },
  { id: 'colors', name: 'Renkler', icon: '🎨', color: '#45B7D1' },
  { id: 'family', name: 'Aile', icon: '👨‍👩‍👧‍👦', color: '#96CEB4' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState<string | null>('greetings')
  const [chatMessages, setChatMessages] = useState([{ role: 'teacher', content: "Hello! I'm Ms. Emma! Let's practice English!" }])
  const [inputMessage, setInputMessage] = useState('')
  const [quizState, setQuizState] = useState({ active: false, current: 0, score: 0 })
  const [quizQuestions, setQuizQuestions] = useState<{word: {en: string, tr: string}, options: string[], correct: number}[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [xp, setXp] = useState(0)

  const speak = (text: string) => { 
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.9
  u.pitch = 1.2
  const voices = speechSynthesis.getVoices()
  const femaleVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female') || v.name.includes('Google US English'))
  if (femaleVoice) u.voice = femaleVoice
  speechSynthesis.speak(u)
}
  const sendMessage = () => {
    if (!inputMessage.trim()) return
    const responses = ["Great job! 💪", "Well done! ⭐", "Keep practicing! 📈"]
    setChatMessages([...chatMessages, { role: 'user', content: inputMessage }, { role: 'teacher', content: responses[Math.floor(Math.random() * responses.length)] }])
    setInputMessage('')
    setXp(prev => prev + 5)
  }

  const startQuiz = () => {
    const allWords = Object.values(vocabulary).flat()
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 5)
    const questions = shuffled.map(word => {
      const wrongAnswers = allWords.filter(w => w.tr !== word.tr).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.tr)
      const options = [...wrongAnswers, word.tr].sort(() => Math.random() - 0.5)
      return { word, options, correct: options.indexOf(word.tr) }
    })
    setQuizQuestions(questions)
    setQuizState({ active: true, current: 0, score: 0 })
    setSelectedAnswer(null)
  }

  const answerQuiz = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const isCorrect = index === quizQuestions[quizState.current].correct
    setTimeout(() => {
      if (quizState.current + 1 >= quizQuestions.length) {
        setQuizState({ active: false, current: 0, score: isCorrect ? quizState.score + 1 : quizState.score })
        setXp(prev => prev + (isCorrect ? quizState.score + 1 : quizState.score) * 10)
      } else {
        setQuizState({ ...quizState, current: quizState.current + 1, score: isCorrect ? quizState.score + 1 : quizState.score })
      }
      setSelectedAnswer(null)
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '10px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '20px', minHeight: '95vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '20px 20px 0 0', color: 'white', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🎓 Gel Konusalim</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '20px' }}>⭐ {xp} XP</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {currentPage === 'home' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}><div style={{ fontSize: '80px' }}>👩‍🏫</div><h2>Merhaba! Ben Ms. Emma</h2></div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div onClick={() => setCurrentPage('vocabulary')} style={{ background: '#FF6B6B', padding: '20px', borderRadius: '15px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}><Book size={30} /><div><div style={{ fontWeight: 'bold' }}>Kelimeler</div></div></div>
                <div onClick={() => setCurrentPage('chat')} style={{ background: '#4ECDC4', padding: '20px', borderRadius: '15px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}><MessageCircle size={30} /><div><div style={{ fontWeight: 'bold' }}>Konusma</div></div></div>
                <div onClick={() => { setCurrentPage('quiz'); startQuiz(); }} style={{ background: '#A78BFA', padding: '20px', borderRadius: '15px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}><Award size={30} /><div><div style={{ fontWeight: 'bold' }}>Quiz</div></div></div>
              </div>
            </div>
          )}
          {currentPage === 'vocabulary' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {categories.map(cat => (<div key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ background: selectedCategory === cat.id ? cat.color : '#f0f0f0', padding: '10px 15px', borderRadius: '20px', cursor: 'pointer', color: selectedCategory === cat.id ? 'white' : '#333' }}>{cat.icon} {cat.name}</div>))}
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {(vocabulary[selectedCategory as keyof typeof vocabulary] || vocabulary.greetings).map((word, index) => (
                  <div key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><div style={{ fontSize: '20px', fontWeight: 'bold' }}>{word.en}</div><div style={{ color: '#666' }}>{word.tr}</div></div>
                      <button onClick={() => speak(word.en)} style={{ background: '#667eea', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', cursor: 'pointer' }}><Volume2 size={20} /></button>
                    </div>
                    <div style={{ marginTop: '10px', padding: '10px', background: '#e8f4f8', borderRadius: '8px' }}>💬 {word.example}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentPage === 'chat' && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                {chatMessages.map((msg, i) => (<div key={i} style={{ marginBottom: '10px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ padding: '12px', borderRadius: '18px', background: msg.role === 'user' ? '#667eea' : '#f0f0f0', color: msg.role === 'user' ? 'white' : '#333' }}>{msg.role === 'teacher' && '👩‍🏫 '}{msg.content}</div></div>))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Write in English..." style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '2px solid #e0e0e0' }} />
                <button onClick={sendMessage} style={{ background: '#667eea', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: 'white', cursor: 'pointer' }}><Send size={20} /></button>
              </div>
            </div>
          )}
          {currentPage === 'quiz' && quizState.active && quizQuestions[quizState.current] && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>Soru {quizState.current + 1} / {quizQuestions.length}</div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}><div style={{ fontSize: '28px', fontWeight: 'bold' }}>{quizQuestions[quizState.current].word.en}</div></div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {quizQuestions[quizState.current].options.map((opt, i) => (<div key={i} onClick={() => answerQuiz(i)} style={{ background: selectedAnswer === null ? '#f8f9fa' : i === quizQuestions[quizState.current].correct ? '#D4EDDA' : selectedAnswer === i ? '#F8D7DA' : '#f8f9fa', padding: '18px', borderRadius: '12px', cursor: 'pointer' }}>{opt}</div>))}
              </div>
            </div>
          )}
          {currentPage === 'quiz' && !quizState.active && (
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '80px' }}>🏆</div><h2>Quiz Bitti!</h2><div style={{ fontSize: '48px', color: '#667eea' }}>{quizState.score} / 5</div><button onClick={startQuiz} style={{ marginTop: '20px', background: '#667eea', border: 'none', borderRadius: '25px', padding: '15px 40px', color: 'white', cursor: 'pointer' }}>Tekrar Dene</button></div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '15px', borderTop: '1px solid #eee' }}>
          <div onClick={() => setCurrentPage('home')} style={{ textAlign: 'center', cursor: 'pointer', color: currentPage === 'home' ? '#667eea' : '#999' }}><Home size={24} /><div style={{ fontSize: '12px' }}>Ana Sayfa</div></div>
          <div onClick={() => setCurrentPage('vocabulary')} style={{ textAlign: 'center', cursor: 'pointer', color: currentPage === 'vocabulary' ? '#667eea' : '#999' }}><Book size={24} /><div style={{ fontSize: '12px' }}>Kelimeler</div></div>
          <div onClick={() => setCurrentPage('chat')} style={{ textAlign: 'center', cursor: 'pointer', color: currentPage === 'chat' ? '#667eea' : '#999' }}><MessageCircle size={24} /><div style={{ fontSize: '12px' }}>Konusma</div></div>
          <div onClick={() => { setCurrentPage('quiz'); startQuiz(); }} style={{ textAlign: 'center', cursor: 'pointer', color: currentPage === 'quiz' ? '#667eea' : '#999' }}><Award size={24} /><div style={{ fontSize: '12px' }}>Quiz</div></div>
        </div>
      </div>
    </div>
  )
}

export default App