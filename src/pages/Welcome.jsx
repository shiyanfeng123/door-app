import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Welcome.css'
import icon from '../assets/icon-192x192.png'

function Welcome() {
  const navigate = useNavigate()

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

    return () => {
      clearTimeout(exitTimer)
    }
  }, [navigate])

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src={icon} alt="Dorr" className="welcome-icon" />
        <p className="welcome-text">Dorr  App</p>
      </div>
    </div>
  )
}

export default Welcome