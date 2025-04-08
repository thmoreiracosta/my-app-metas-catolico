// public/sw.js

self.addEventListener('install', (event) => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Ativado');
  return self.clients.claim();
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
