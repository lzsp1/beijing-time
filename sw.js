// Service Worker for 北京时间自动更新
// 版本号，每次更新时需要修改这个值
const CACHE_NAME = 'beijing-time-v4.0.2';
const urlsToCache = [
  '/',
  '/北京时间.html',
  '/update.json'
];

// 安装事件 - 预缓存文件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 跳过等待，立即激活新的Service Worker
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除旧缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// Fetch事件 - 处理网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中存在，返回缓存的响应
        if (response) {
          return response;
        }
        // 否则从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // 克隆响应，因为响应流只能使用一次
            const responseToCache = response.clone();
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// 监听消息事件 - 接收来自客户端的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 定期检查更新（每10分钟）
setInterval(() => {
  self.registration.update();
}, 10 * 60 * 1000);
