// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// 配置Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDq7c4_pLV2M2Iu2P47AYZO6u0JKrcaQ1E",
  authDomain: "dorr-94ad8.firebaseapp.com",
  projectId: "dorr-94ad8",
  storageBucket: "dorr-94ad8.firebasestorage.app",
  messagingSenderId: "957460099096",
  appId: "1:957460099096:web:6597c0329db3631200936d",
  measurementId: "G-MHGBZE4JE0"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);

// 获取消息传递实例
const messaging = firebase.messaging();

// 处理后台消息
messaging.onBackgroundMessage((payload) => {
  console.log('收到后台消息:', payload);
  
  // 自定义通知
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/door-app/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
