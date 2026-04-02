import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(255, ${Math.random() * 100 + 100}, ${Math.random() * 150 + 100}, ${Math.random() * 0.5 + 0.5})`
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      }
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="home-container">
      <canvas ref={canvasRef} className="canvas-bg" />
      <h1 className="app-title">Dorr.</h1>
      <div className="button-container">
        <button 
          className="function-button order-button"
          onClick={() => navigate('/order')}
        >
          <span className="button-icon">🍽️</span>
          <span className="button-text">Order</span>
        </button>
        <button 
          className="function-button anniversary-button"
          onClick={() => navigate('/anniversary')}
        >
          <span className="button-icon">🎂</span>
          <span className="button-text">Anniversary</span>
        </button>
      </div>
    </div>
  )
}

export default Home