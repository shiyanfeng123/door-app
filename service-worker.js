const CACHE_NAME = 'dorr-app-cache-v1';

// 安装 Service Worker 时缓存核心资源
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 激活 Service Worker 时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// 处理网络请求
self.addEventListener('fetch', event => {
  // 对于导航请求，始终从网络获取
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 如果网络请求失败，尝试从缓存获取
          return caches.match(event.request);
        })
    );
    return;
  }

  // 对于其他请求，使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，返回缓存的响应
        if (response) {
          return response;
        }

        // 否则从网络获取
        return fetch(event.request)
          .then(networkResponse => {
            // 对于成功的网络响应，将其添加到缓存
            if (networkResponse && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          });
      })
  );
});