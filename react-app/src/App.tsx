import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">SoundGang Music Label</h1>
              <p className="text-muted-foreground">React Router Migration - Ready to Start! 🎵</p>
              <div className="flex gap-4 justify-center mt-8">
                <a 
                  href="/about" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  About
                </a>
                <a 
                  href="/admin" 
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        } />
        <Route path="/about" element={<div className="p-8">About Page (Coming Soon)</div>} />
        <Route path="/admin" element={<div className="p-8">Admin Area (Coming Soon)</div>} />
      </Routes>
    </Router>
  )
}

export default App
