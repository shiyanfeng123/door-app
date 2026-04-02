import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    // 3秒后开始出场动画
    const exitTimer = setTimeout(() => {
      const container = document.querySelector('.welcome-container')
      if (container) {
        container.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out'
        container.style.transform = 'translateX(-100%)'
        container.style.opacity = '0'
        
        // 动画结束后跳转
        setTimeout(() => {
          navigate('/home')
        }, 600)
      } else {
        navigate('/home')
      }
    }, 4000)

    // 背景动画
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = 0
        this.targetOpacity = Math.random() * 0.6 + 0.2
        this.fadeInSpeed = 0.03
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        // 边界检测
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
        
        // 淡入效果
        if (this.opacity < this.targetOpacity) {
          this.opacity += this.fadeInSpeed
        }
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // 创建粒子数组
    const particles = []
    const particleCount = 50
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 绘制粒子
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // 绘制粒子间的连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 80) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/80)})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      clearTimeout(exitTimer)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [navigate])

  return (
    <div className="welcome-container">
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      <div className="welcome-content">
        <h1>欢迎使用，月月</h1>
        <p>Dorr</p>
      </div>
    </div>
  )
}

export default Welcome