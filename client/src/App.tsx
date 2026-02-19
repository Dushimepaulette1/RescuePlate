import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Welcome to RescuePlate</h1>
              <p className="text-gray-300 mb-8">Save food, save money!</p>
              <div className="space-x-4">
                <a href="/login" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">
                  Login
                </a>
                <a href="/register" className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}


export default App
