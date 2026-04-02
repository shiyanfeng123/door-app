import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Anniversary.css'
import indexedDB from '../utils/indexedDB'

function Anniversary() {
  const navigate = useNavigate()
  const [anniversaries, setAnniversaries] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentAnniversary, setCurrentAnniversary] = useState({
    id: null,
    title: '',
    date: ''
  })

  // 从IndexedDB加载纪念日数据
  useEffect(() => {
    const loadAnniversaries = async () => {
      try {
        console.log('开始加载纪念日数据...')
        const savedAnniversaries = await indexedDB.getAllAnniversaries()
        console.log('IndexedDB中的数据:', savedAnniversaries)
        if (savedAnniversaries) {
          // 确保数据结构正确，移除reason字段（如果存在）
          const cleanedAnniversaries = savedAnniversaries.map(item => ({
            id: item.id,
            title: item.title,
            date: item.date
          }))
          console.log('清理后的数据:', cleanedAnniversaries)
          setAnniversaries(cleanedAnniversaries)
        } else {
          console.log('IndexedDB中没有数据，初始化为空数组')
          setAnniversaries([])
        }
      } catch (error) {
        console.error('加载纪念日数据失败:', error)
        // 如果加载失败，设置为空数组
        setAnniversaries([])
      }
    }
    loadAnniversaries()
  }, [])

  // 标记是否是首次加载
  const isFirstLoad = useRef(true)

  // 保存纪念日数据到IndexedDB
  useEffect(() => {
    const saveAnniversaries = async () => {
      try {
        // 首次加载时不保存，避免覆盖从IndexedDB加载的数据
        if (isFirstLoad.current) {
          console.log('首次加载，跳过保存')
          isFirstLoad.current = false
          return
        }
        
        console.log('开始保存纪念日数据...')
        console.log('要保存的数据:', anniversaries)
        
        // 先清空现有数据
        await indexedDB.clear('anniversaries')
        
        // 保存所有纪念日
        for (const anniversary of anniversaries) {
          await indexedDB.addAnniversary(anniversary)
        }
        
        console.log('保存成功！')
      } catch (error) {
        console.error('保存纪念日数据失败:', error)
      }
    }
    saveAnniversaries()
  }, [anniversaries])

  const handleAddAnniversary = () => {
    setCurrentAnniversary({
      id: null,
      title: '',
      date: ''
    })
    setIsAddModalOpen(true)
  }

  const handleEditAnniversary = (anniversary) => {
    setCurrentAnniversary(anniversary)
    setIsEditModalOpen(true)
  }

  const handleDeleteAnniversary = async (id) => {
    if (window.confirm('确定要删除这个纪念日吗？')) {
      try {
        const updatedAnniversaries = anniversaries.filter(item => item.id !== id)
        setAnniversaries(updatedAnniversaries)
        // 立即从IndexedDB删除
        await indexedDB.deleteAnniversary(id)
      } catch (error) {
        console.error('删除纪念日失败:', error)
      }
    }
  }

  const handleSaveAnniversary = async () => {
    if (!currentAnniversary.title || !currentAnniversary.date) {
      alert('请填写标题和日期')
      return
    }

    let updatedAnniversaries
    if (currentAnniversary.id) {
      // 编辑现有纪念日
      updatedAnniversaries = anniversaries.map(item => 
        item.id === currentAnniversary.id ? currentAnniversary : item
      )
      setAnniversaries(updatedAnniversaries)
      setIsEditModalOpen(false)
      
      // 立即更新到IndexedDB
      try {
        await indexedDB.updateAnniversary(currentAnniversary)
      } catch (error) {
        console.error('更新纪念日失败:', error)
      }
    } else {
      // 添加新纪念日
      const newAnniversary = {
        ...currentAnniversary,
        id: Date.now()
      }
      updatedAnniversaries = [...anniversaries, newAnniversary]
      setAnniversaries(updatedAnniversaries)
      setIsAddModalOpen(false)
      
      // 立即添加到IndexedDB
      try {
        await indexedDB.addAnniversary(newAnniversary)
      } catch (error) {
        console.error('添加纪念日失败:', error)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentAnniversary(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 计算距离今天还有多少天
  const getDaysUntilAnniversary = (dateString) => {
    const today = new Date()
    const anniversaryDate = new Date(dateString)
    const currentYear = today.getFullYear()
    anniversaryDate.setFullYear(currentYear)
    
    // 如果今年的纪念日已经过了，计算明年的
    if (anniversaryDate < today) {
      anniversaryDate.setFullYear(currentYear + 1)
    }
    
    const timeDiff = anniversaryDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff
  }

  return (
    <div className="anniversary-container">
      <div className="anniversary-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          &lt;
        </button>
        <h1>纪念日</h1>
        <div className="header-actions">
          <button className="add-button" onClick={handleAddAnniversary}>
            + 添加
          </button>
        </div>
      </div>

      <div className="anniversary-content">
        {anniversaries.length === 0 ? (
          <div className="empty-state">
            <p>还没有添加任何纪念日</p>
            <p className="empty-hint">点击右上角的 + 按钮添加第一个纪念日吧！</p>
          </div>
        ) : (
          <div className="anniversary-list">
            {anniversaries.map(anniversary => (
              <div key={anniversary.id} className="anniversary-item">
                <div className="anniversary-row">
                  <div className="anniversary-name">{anniversary.title}</div>
                  <div className="anniversary-days">还有 {getDaysUntilAnniversary(anniversary.date)} 天</div>
                </div>
                <div className="anniversary-row">
                  <div className="anniversary-date">{anniversary.date}</div>
                  <div className="anniversary-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEditAnniversary(anniversary)}
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteAnniversary(anniversary.id)}
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加/编辑纪念日模态框 */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isAddModalOpen ? '添加纪念日' : '编辑纪念日'}</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="title">纪念日标题</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentAnniversary.title}
                  onChange={handleInputChange}
                  placeholder="例如：结婚纪念日"
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">日期</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={currentAnniversary.date}
                  onChange={handleInputChange}
                />
              </div>

            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setIsEditModalOpen(false)
                }}
              >
                取消
              </button>
              <button 
                className="save-button"
                onClick={handleSaveAnniversary}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Anniversary