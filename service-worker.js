// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {});

self.addEventListener('push', function (event) {
        console.log('Received a push message', event);
        var title = "やろうぜ路上カバディ！！";
        var body = "茶色の服のおっさんがあなたを呼んでいます";

        event.waitUntil(
                    self.registration.showNotification(title, {
                                    body: body,
                                    icon: './icon-192',
                                    tag: 'push-notification-tag'
                                })
                );
});
self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        clients.openWindow("/");
}, false);
