import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Order from './pages/Order'
import Anniversary from './pages/Anniversary'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/anniversary" element={<Anniversary />} />
      </Routes>
    </Router>
  )
}

export default App