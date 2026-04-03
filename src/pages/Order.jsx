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
              { id: 1, name: '清炒时蔬', image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.M3h4e_FYaIqmMKchZGX1SQHaEc?w=298&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
              { id: 2, name: '凉拌黄瓜', image: 'https://pic1.zhimg.com/v2-b6ead3fee1347f50716fec5e6fdbc849_1440w.jpg?source=172ae18b' },
              { id: 3, name: '蒜蓉西兰花', image: 'https://q6.itc.cn/q_70/images03/20251224/4559031f37554fee8e4149bd3681135e.jpeg' },
              { id: 4, name: '酸辣土豆丝', image: 'https://i2.chuimg.com/f981ad54d4654870bb63582a7520b410_2669w_2560h.jpg?imageView2/2/w/660/interlace/1/q/90' },
              { id: 5, name: '麻婆豆腐', image: 'https://img.zcool.cn/community/0170cd5aa890c4a80121246d1c8687.jpeg' },
              { id: 6, name: '素炒空心菜', image: 'https://img0.baidu.com/it/u=3104572257,1707828244&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
              { id: 7, name: '茄子煲', image: 'https://qcloud.dpfile.com/pc/a3HY-c3Y6GzuUuhdFxTE5qzaAr07C5o1sZEkTGgK8x4o-MshgBbiA_3Mv0AKp4cx.jpg' },
              { id: 8, name: '番茄炒蛋', image: 'https://qcloud.dpfile.com/pc/9F9l0BNqqiloRc36PpgaBW1ObNjAj15IGdu5qYqLrg-XTyzltWS0cMQz64oljHcX.jpg' },
              { id: 41, name: '清炒西兰花', image: 'https://q6.itc.cn/q_70/images03/20251224/4559031f37554fee8e4149bd3681135e.jpeg' },
              { id: 42, name: '凉拌木耳', image: 'https://pic.rmb.bdstatic.com/bjh/3eab4be3f94/251224/2ae117ca472ac8444bb00a2bfaa9a78a.png' },
              { id: 43, name: '素炒土豆丝', image: 'https://img2.baidu.com/it/u=930048019,2490339050&fm=253&app=138&f=JPEG?w=760&h=760' },
              { id: 44, name: '清炒豆芽', image: 'https://img1.baidu.com/it/u=1223912457,201335844&fm=253&app=138&f=JPEG?w=800&h=893' }
            ],
            '荤菜': [
              { id: 9, name: '红烧肉', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 10, name: '糖醋排骨', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 11, name: '可乐鸡翅', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 12, name: '清蒸鱼', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 13, name: '白切鸡', image: 'https://qcloud.dpfile.com/pc/ZEoUNtWAVJa1T7F7WYA4ZHmgVtc5TEt4B62aUctd_nZFv4sxV7lda77-V7oOm3Rb.jpg' },
              { id: 14, name: '烤鸭', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' },
              { id: 15, name: '卤味拼盘', image: 'https://img0.baidu.com/it/u=3104572257,1707828244&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500' },
              { id: 16, name: '梅菜扣肉', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 45, name: '红烧排骨', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 46, name: '红烧鱼', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 47, name: '炸鸡', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 48, name: '烤肠', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' }
            ],
            '炒肉菜': [
              { id: 17, name: '青椒肉丝', image: 'https://qcloud.dpfile.com/pc/ZEoUNtWAVJa1T7F7WYA4ZHmgVtc5TEt4B62aUctd_nZFv4sxV7lda77-V7oOm3Rb.jpg' },
              { id: 18, name: '宫保鸡丁', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 19, name: '鱼香肉丝', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' },
              { id: 20, name: '回锅肉', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 21, name: '炒牛肉', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 22, name: '炒羊肉', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 23, name: '炒猪肉', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 24, name: '炒鸡肉', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 49, name: '洋葱炒肉', image: 'https://qcloud.dpfile.com/pc/ZEoUNtWAVJa1T7F7WYA4ZHmgVtc5TEt4B62aUctd_nZFv4sxV7lda77-V7oOm3Rb.jpg' },
              { id: 50, name: '蒜苔炒肉', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' },
              { id: 51, name: '豆角炒肉', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 52, name: '木耳炒肉', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' }
            ],
            '大荤菜': [
              { id: 25, name: '海参煲', image: 'https://qcloud.dpfile.com/pc/ZEoUNtWAVJa1T7F7WYA4ZHmgVtc5TEt4B62aUctd_nZFv4sxV7lda77-V7oOm3Rb.jpg' },
              { id: 26, name: '鲍鱼汤', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 27, name: '龙虾', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' },
              { id: 28, name: '螃蟹', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 29, name: '牛排', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 30, name: '羊排', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 31, name: '猪排', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 32, name: '鸡排', image: 'https://se-feed-bucket.cdn.bcebos.com/map_uigc_food_goout/ae4ec1a93f89c6ff6d81f218cc32d7a9.jpg' },
              { id: 53, name: '烤羊腿', image: 'https://qcloud.dpfile.com/pc/ZEoUNtWAVJa1T7F7WYA4ZHmgVtc5TEt4B62aUctd_nZFv4sxV7lda77-V7oOm3Rb.jpg' },
              { id: 54, name: '烤猪蹄', image: 'https://hellorfimg.zcool.cn/provider_image/large/hi2241668046.jpg' },
              { id: 55, name: '清蒸大闸蟹', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 56, name: '蒜蓉扇贝', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' }
            ],
            '汤类': [
              { id: 33, name: '番茄蛋汤', image: 'https://t15.baidu.com/it/u=11372547942596920737,6395912520500375963&fm=3008&app=3011&f=JPEG' },
              { id: 34, name: '紫菜蛋汤', image: 'https://img1.baidu.com/it/u=2178487590,1049227004&fm=253&app=138&f=JPEG?w=800&h=1066' },
              { id: 35, name: '排骨汤', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 36, name: '鸡汤', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 37, name: '鱼汤', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 38, name: '菌菇汤', image: 'https://img1.baidu.com/it/u=2178487590,1049227004&fm=253&app=138&f=JPEG?w=800&h=1066' },
              { id: 39, name: '酸辣汤', image: 'https://t15.baidu.com/it/u=11372547942596920737,6395912520500375963&fm=3008&app=3011&f=JPEG' },
              { id: 40, name: '胡辣汤', image: 'https://qcloud.dpfile.com/pc/gh687mThezBAqp2HC0ZwCE3S_GOQ1zWChlV3vcx4aW5TLyq1kbIKqgaHguXO0-Gl.jpg' },
              { id: 57, name: '冬瓜排骨汤', image: 'https://gips0.baidu.com/it/u=3312126888,470524869&fm=3074&app=3074&f=JPEG' },
              { id: 58, name: '玉米排骨汤', image: 'https://q8.itc.cn/images01/20250306/cb163d941abf4331930fbc4e0dcdc44b.jpeg' },
              { id: 59, name: '萝卜汤', image: 'https://img1.baidu.com/it/u=2178487590,1049227004&fm=253&app=138&f=JPEG?w=800&h=1066' },
              { id: 60, name: '海带汤', image: 'https://t15.baidu.com/it/u=11372547942596920737,6395912520500375963&fm=3008&app=3011&f=JPEG' }
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

    // 构建通知内容
    let notificationBody = '点菜清单：\n';
    Object.values(selectedDishes).forEach(dish => {
      notificationBody += `${dish.name} × ${dish.quantity}\n`;
    });

    // 发送通知
    if (window.sendNotification) {
      // 这里可以使用之前获取的目标设备FCM令牌
      // 实际项目中，应该从存储中获取保存的目标设备FCM令牌
      console.log('发送通知，内容：', notificationBody);
      // 调用发送通知函数
      window.sendNotification(notificationBody);
    } else {
      // 由于我们没有真实的后端服务器，这里只是模拟发送
      alert('通知已发送，内容：\n' + notificationBody);
    }

    // 发送 OneSignal 通知
    if (window.OneSignal) {
      window.OneSignal.sendTag('order_count', Object.values(selectedDishes).length);
      // 这里可以通过 OneSignal 控制台或 API 发送通知
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
                text: notificationBody,
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