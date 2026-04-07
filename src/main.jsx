import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// OneSignal 初始化
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
  OneSignal.init({
    appId: "8c37e53b-1be9-422f-8efc-a2440a4e51af", // 替换为你的 OneSignal App ID
    autoRegister: true,
    notifyButton: {
      enable: true
    },
    safari_web_id: "web.onesignal.auto.466e18d3-e8b5-4577-916c-b7c634612f08", // Safari 配置
    welcomeNotification: {
      disable: true
    },
    serviceWorkerPath: 'https://shiyanfeng123.github.io/door-app/OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: 'https://shiyanfeng123.github.io/door-app/OneSignalSDKUpdaterWorker.js'
  });

  // 监听初始化完成事件
  OneSignal.on('initialized', function() {
    console.log('OneSignal 初始化完成');
    // 初始化完成后尝试获取 Player ID
    OneSignal.getUserId().then(function(playerId) {
      if (playerId) {
        console.log('OneSignal Player ID (初始化后):', playerId);
      } else {
        console.log('初始化后未获取到 Player ID，等待订阅');
      }
    });
  });

  // 监听通知权限变更
  OneSignal.on('permissionChange', function(permissionChange) {
    console.log('通知权限变更:', permissionChange);
    if (permissionChange.hasPermission) {
      // 权限获取后尝试获取 Player ID
      OneSignal.getUserId().then(function(playerId) {
        if (playerId) {
          console.log('OneSignal Player ID (权限获取后):', playerId);
        }
      });
    }
  });

  // 监听订阅状态变更
  OneSignal.on('subscriptionChange', function(isSubscribed) {
    console.log('订阅状态变更:', isSubscribed);
    if (isSubscribed) {
      // 获取 Player ID
      OneSignal.getUserId().then(function(playerId) {
        console.log('OneSignal Player ID (订阅后):', playerId);
        // 这里可以将 Player ID 发送到后端
        if (playerId) {
          // 示例：发送到后端 API
          fetch('/api/save-player-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player_id: playerId })
          })
          .then(response => response.json())
          .then(data => console.log('保存 Player ID 成功:', data))
          .catch(error => console.error('保存 Player ID 失败:', error));
        }
      });
    }
  });

  // 手动检查订阅状态和获取 Player ID
  setTimeout(function() {
    OneSignal.getUserId().then(function(playerId) {
      if (playerId) {
        console.log('OneSignal Player ID (手动检查):', playerId);
      } else {
        console.log('手动检查未获取到 Player ID');
        // 尝试手动注册
        OneSignal.registerForPushNotifications();
      }
    });
  }, 3000);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)