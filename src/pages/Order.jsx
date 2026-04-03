import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import './Order.css'
import indexedDB from '../utils/indexedDB'
import defaultDishIcon from '../assets/images/default-dish.svg'

function Order() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('素菜')
  const [selectedDishes, setSelectedDishes] = useState({})
  const [isSelectedExpanded, setIsSelectedExpanded] = useState(false)
  const [isManageMode, setIsManageMode] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentDish, setCurrentDish] = useState({
    id: null,
    name: '',
    category: '素菜',
    image: ''
  })
  const [dishes, setDishes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const categoryRefs = useRef({})
  const menuRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // 从IndexedDB加载选中的菜品
  useEffect(() => {
    const loadSelectedDishes = async () => {
      try {
        const savedSelectedDishes = await indexedDB.get('selectedDishes', 'selectedDishes')
        if (savedSelectedDishes) {
          setSelectedDishes(savedSelectedDishes)
        }
      } catch (error) {
        console.error('加载选中菜品失败:', error)
      }
    }
    loadSelectedDishes()
  }, [])
  
  // 保存选中的菜品到IndexedDB
  useEffect(() => {
    const saveSelectedDishes = async () => {
      try {
        await indexedDB.save('selectedDishes', 'selectedDishes', selectedDishes)
      } catch (error) {
        console.error('保存选中菜品失败:', error)
      }
    }
    saveSelectedDishes()
  }, [selectedDishes])
  
  // 处理分类点击，滚动到对应分类
  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    categoryRefs.current[category]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  
  const categories = ['素菜', '荤菜', '炒肉菜', '大荤菜', '汤类']

  // 处理滚动，更新当前活跃分类
  const handleScroll = () => {
    const dishListElement = document.querySelector('.dish-list')
    if (!dishListElement) return
    
    const scrollPosition = dishListElement.scrollTop + 50
    
    // 遍历所有分类，找到当前滚动位置对应的分类
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i]
      const element = categoryRefs.current[category]
      if (element) {
        // 获取当前分类的顶部位置
        const offsetTop = element.offsetTop
        
        // 获取当前分类的底部位置
        let offsetBottom = Infinity
        if (i < categories.length - 1) {
          const nextCategory = categories[i + 1]
          const nextElement = categoryRefs.current[nextCategory]
          if (nextElement) {
            offsetBottom = nextElement.offsetTop
          }
        }
        
        // 检查滚动位置是否在当前分类范围内
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveCategory(category)
          break
        }
      }
    }
  }
  
  // 添加滚动监听
  useEffect(() => {
    const dishListElement = document.querySelector('.dish-list')
    if (dishListElement) {
      dishListElement.addEventListener('scroll', handleScroll)
      return () => {
        dishListElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // 从IndexedDB加载菜品数据
  useEffect(() => {
    const loadDishes = async () => {
      try {
        const savedDishes = await indexedDB.get('dishes', 'dishes')
        if (savedDishes) {
          setDishes(savedDishes)
        } else {
          // 初始化默认菜品数据
          const defaultDishes = {
            '素菜': [
              { id: 1, name: '清炒时蔬', image: '' },
              { id: 2, name: '凉拌黄瓜', image: '' },
              { id: 3, name: '蒜蓉西兰花', image: '' },
              { id: 4, name: '酸辣土豆丝', image: '' },
              { id: 5, name: '麻婆豆腐', image: '' },
              { id: 6, name: '素炒空心菜', image: '' },
              { id: 7, name: '茄子煲', image: '' },
              { id: 8, name: '番茄炒蛋', image: '' },
              { id: 41, name: '清炒西兰花', image: '' },
              { id: 42, name: '凉拌木耳', image: '' },
              { id: 43, name: '素炒土豆丝', image: '' },
              { id: 44, name: '清炒豆芽', image: '' }
            ],
            '荤菜': [
              { id: 9, name: '红烧肉', image: '' },
              { id: 10, name: '糖醋排骨', image: '' },
              { id: 11, name: '可乐鸡翅', image: '' },
              { id: 12, name: '清蒸鱼', image: '' },
              { id: 13, name: '白切鸡', image: '' },
              { id: 14, name: '烤鸭', image: '' },
              { id: 15, name: '卤味拼盘', image: '' },
              { id: 16, name: '梅菜扣肉', image: '' },
              { id: 45, name: '红烧排骨', image: '' },
              { id: 46, name: '红烧鱼', image: '' },
              { id: 47, name: '炸鸡', image: '' },
              { id: 48, name: '烤肠', image: '' }
            ],
            '炒肉菜': [
              { id: 17, name: '青椒肉丝', image: '' },
              { id: 18, name: '宫保鸡丁', image: '' },
              { id: 19, name: '鱼香肉丝', image: '' },
              { id: 20, name: '回锅肉', image: '' },
              { id: 21, name: '炒牛肉', image: '' },
              { id: 22, name: '炒羊肉', image: '' },
              { id: 23, name: '炒猪肉', image: '' },
              { id: 24, name: '炒鸡肉', image: '' },
              { id: 49, name: '洋葱炒肉', image: '' },
              { id: 50, name: '蒜苔炒肉', image: '' },
              { id: 51, name: '豆角炒肉', image: '' },
              { id: 52, name: '木耳炒肉', image: '' }
            ],
            '大荤菜': [
              { id: 25, name: '海参煲', image: '' },
              { id: 26, name: '鲍鱼汤', image: '' },
              { id: 27, name: '龙虾', image: '' },
              { id: 28, name: '螃蟹', image: '' },
              { id: 29, name: '牛排', image: '' },
              { id: 30, name: '羊排', image: '' },
              { id: 31, name: '猪排', image: '' },
              { id: 32, name: '鸡排', image: '' },
              { id: 53, name: '烤羊腿', image: '' },
              { id: 54, name: '烤猪蹄', image: '' },
              { id: 55, name: '清蒸大闸蟹', image: '' },
              { id: 56, name: '蒜蓉扇贝', image: '' }
            ],
            '汤类': [
              { id: 33, name: '番茄蛋汤', image: '' },
              { id: 34, name: '紫菜蛋汤', image: '' },
              { id: 35, name: '排骨汤', image: '' },
              { id: 36, name: '鸡汤', image: '' },
              { id: 37, name: '鱼汤', image: '' },
              { id: 38, name: '菌菇汤', image: '' },
              { id: 39, name: '酸辣汤', image: '' },
              { id: 40, name: '胡辣汤', image: '' },
              { id: 57, name: '冬瓜排骨汤', image: '' },
              { id: 58, name: '玉米排骨汤', image: '' },
              { id: 59, name: '萝卜汤', image: '' },
              { id: 60, name: '海带汤', image: '' }
            ]
          }
          setDishes(defaultDishes)
          await indexedDB.save('dishes', 'dishes', defaultDishes)
        }
      } catch (error) {
        console.error('加载菜品数据失败:', error)
      }
    }
    loadDishes()
  }, [])

  // 保存菜品数据到IndexedDB
  useEffect(() => {
    const saveDishes = async () => {
      try {
        if (Object.keys(dishes).length > 0) {
          await indexedDB.save('dishes', 'dishes', dishes)
        }
      } catch (error) {
        console.error('保存菜品数据失败:', error)
      }
    }
    saveDishes()
  }, [dishes])

  const handleAddDish = (dish) => {
    setSelectedDishes(prev => ({
      ...prev,
      [dish.id]: {
        ...dish,
        quantity: (prev[dish.id]?.quantity || 0) + 1
      }
    }))
  }

  const handleRemoveDish = (dishId) => {
    setSelectedDishes(prev => {
      const newState = { ...prev }
      if (newState[dishId].quantity > 1) {
        newState[dishId].quantity -= 1
      } else {
        delete newState[dishId]
      }
      return newState
    })
  }

  const handleGenerateMenu = async () => {
    if (Object.keys(selectedDishes).length === 0) {
      alert('请先点一些菜')
      return
    }

    // 发送 OneSignal 通知（仅在OneSignal可用时）
    if (window.OneSignal && typeof window.OneSignal.sendTag === 'function') {
      try {
        window.OneSignal.sendTag('order_count', Object.values(selectedDishes).length);
        console.log('OneSignal通知已发送');
      } catch (error) {
        console.error('发送OneSignal通知失败:', error);
      }
    }

    if (menuRef.current) {
      try {
        const canvas = await html2canvas(menuRef.current)
        
        // 将 canvas 转换为 blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert('截图生成失败')
            return
          }

          // 检查浏览器是否支持 Web Share API 分享文件
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [blob] })) {
            try {
              await navigator.share({
                title: '我的点菜清单',
                text: '看看我点的菜',
                files: [
                  new File([blob], 'menu.png', { type: 'image/png' })
                ]
              })
              console.log('分享成功')
            } catch (error) {
              console.error('分享失败:', error)
            }
          } else {
            // 浏览器不支持分享文件，提供下载选项
            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = 'menu.png'
            link.href = dataUrl
            link.click()
            alert('您的浏览器不支持分享功能，已为您下载截图')
          }
        }, 'image/png', 1.0)
      } catch (error) {
        console.error('生成菜单图片失败:', error)
      }
    }
  }

  const handleManageClick = () => {
    setIsManageMode(!isManageMode)
  }

  const handleAddNewDish = () => {
    setCurrentDish({
      id: null,
      name: '',
      category: '素菜',
      image: ''
    })
    setIsAddModalOpen(true)
  }

  const handleEditDish = (dish, category) => {
    setCurrentDish({ ...dish, category })
    setIsEditModalOpen(true)
  }

  const handleDeleteDish = (dishId, category) => {
    if (window.confirm('确定要删除这个菜品吗？')) {
      setDishes(prev => ({
        ...prev,
        [category]: prev[category].filter(dish => dish.id !== dishId)
      }))
    }
  }

  const handleSaveDish = () => {
    if (!currentDish.name || !currentDish.image) {
      alert('请填写菜品名称和图片')
      return
    }

    if (currentDish.id) {
      // 编辑现有菜品
      setDishes(prev => {
        const newDishes = { ...prev }
        for (const category in newDishes) {
          newDishes[category] = newDishes[category].map(dish => 
            dish.id === currentDish.id ? currentDish : dish
          )
        }
        return newDishes
      })
      
      // 同时更新已点菜品中的对应菜品数据
      setSelectedDishes(prev => {
        const newSelectedDishes = { ...prev }
        if (newSelectedDishes[currentDish.id]) {
          newSelectedDishes[currentDish.id] = {
            ...newSelectedDishes[currentDish.id],
            name: currentDish.name,
            image: currentDish.image,
            category: currentDish.category
          }
        }
        return newSelectedDishes
      })
      
      setIsEditModalOpen(false)
    } else {
      // 添加新菜品
      const newDish = {
        ...currentDish,
        id: Date.now()
      }
      setDishes(prev => ({
        ...prev,
        [currentDish.category]: [...prev[currentDish.category], newDish]
      }))
      setIsAddModalOpen(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentDish(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentDish(prev => ({
          ...prev,
          image: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getSelectedCount = () => {
    return Object.values(selectedDishes).reduce((total, dish) => total + dish.quantity, 0)
  }

  return (
    <div className="order-container">
      <div className="order-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          &lt;
        </button>
        <h1>点菜</h1>
        <div className="header-actions">
          <button className="manage-button" onClick={handleManageClick}>
            {isManageMode ? '返回' : '管理'}
          </button>
        </div>
      </div>
      
      {isManageMode ? (
        <div className="manage-content">
          <div className="manage-header">
            <h2>菜品管理</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="搜索菜品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="add-dish-button" onClick={handleAddNewDish}>
              + 新增
            </button>
          </div>
          <div className="manage-dish-list">
            {categories.map(category => (
              <div key={category} className="manage-category">
                <h3>{category}</h3>
                <div className="manage-dish-grid">
                  {dishes[category]?.filter(dish => 
                    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(dish => (
                    <div key={dish.id} className="manage-dish-item">
                      <img src={dish.image || defaultDishIcon} alt={dish.name} className="manage-dish-image" />
                      <h4>{dish.name}</h4>
                      <div className="manage-dish-actions">
                        <button 
                          className="manage-action-button edit"
                          onClick={() => handleEditDish(dish, category)}
                          title="编辑"
                        />
                        <button 
                          className="manage-action-button delete"
                          onClick={() => handleDeleteDish(dish.id, category)}
                          title="删除"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="order-content">
          <div className="order-content-main">
            <div className="category-nav">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="dish-list">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="搜索菜品..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              {categories.map(category => (
                <div key={category}>
                  <div 
                    ref={el => categoryRefs.current[category] = el}
                    className="category-title"
                  >
                    {category}
                  </div>
                  {dishes[category]?.filter(dish => 
                    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(dish => (
                    <div key={dish.id} className="dish-item">
                      <div className="dish-image-container">
                        <img src={dish.image || defaultDishIcon} alt={dish.name} className="dish-image" />
                      </div>
                      <div className="dish-info">
                        <h3>{dish.name}</h3>
                        <div className="dish-actions">
                          <button 
                            className="action-button remove"
                            onClick={() => handleRemoveDish(dish.id)}
                            disabled={!selectedDishes[dish.id]}
                          >
                            -
                          </button>
                          <span className="dish-quantity">
                            {selectedDishes[dish.id]?.quantity || 0}
                          </span>
                          <button 
                            className="action-button add"
                            onClick={() => handleAddDish(dish)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!isManageMode && (
        <div className="order-footer">
          {isSelectedExpanded && (
            <div className="selected-list">
              {Object.values(selectedDishes).map(dish => (
                <div key={dish.id} className="selected-item">
                  <img src={dish.image || defaultDishIcon} alt={dish.name} className="selected-item-image" />
                  <div className="selected-item-info">
                    <span className="selected-item-name">{dish.name}</span>
                    <span className="selected-item-quantity">×{dish.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="order-footer-content">
            <div 
              className="selected-dishes" 
              onClick={() => setIsSelectedExpanded(!isSelectedExpanded)}
            >
              <div className="selected-header">
                <h3>已点菜品</h3>
                <span className="selected-count">{getSelectedCount()} 份</span>
              </div>
            </div>
            <div className="generate-button-container">
              <button className="generate-button" onClick={handleGenerateMenu}>
                我点好啦
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 用于生成图片的菜单区域 */}
      <div ref={menuRef} className="menu-for-image">
        <h2>点菜清单</h2>
        <div className="menu-dishes">
          {Object.values(selectedDishes).map(dish => (
            <div key={dish.id} className="menu-dish-item">
              <img src={dish.image || defaultDishIcon} alt={dish.name} className="menu-dish-image" />
              <div className="menu-dish-info">
                <span className="menu-dish-name">{dish.name}</span>
                <span className="menu-dish-quantity">×{dish.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 添加/编辑菜品模态框 */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isAddModalOpen ? '新增菜品' : '编辑菜品'}</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="name">菜品名称</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentDish.name}
                  onChange={handleInputChange}
                  placeholder="请输入菜品名称"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">品类</label>
                <select
                  id="category"
                  name="category"
                  value={currentDish.category}
                  onChange={handleInputChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="image">菜品图片</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                {currentDish.image && (
                  <img 
                    src={currentDish.image} 
                    alt="预览" 
                    className="image-preview"
                  />
                )}
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
                onClick={handleSaveDish}
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

export default Order