importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyChG555tHVlct1JFBdTCFHiz1-vRqEE5cs",
  authDomain: "noti-app-5f5fc.firebaseapp.com",
  projectId: "noti-app-5f5fc",
  storageBucket: "noti-app-5f5fc.firebasestorage.app",
  messagingSenderId: "310800300484",
  appId: "1:310800300484:web:68002dc46004b2c6944c91"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Hàm lấy userId từ cookie trong service worker
const getUserIdFromCookie = () => {
  return self.clients.matchAll().then(clients => {
    const client = clients.find(c => c.url === location.origin);
    if (client) {
      const cookies = client.cookies;
      const name = "userId=";
      const decodedCookie = decodeURIComponent(cookies);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
    }
    return "1"; // Mặc định là 1 nếu không tìm thấy
  });
};

// Quản lý trạng thái thông báo
let notificationQueue = [];

messaging.onBackgroundMessage((payload) => {
  getUserIdFromCookie().then(userId => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
      image: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
      badge: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
      vibrate: [200, 100, 200],
      actions: [
        { action: "open", title: "Xem chi tiết", icon: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg" },
        { action: "dismiss", title: "Bỏ qua", icon: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg" }
      ],
      requireInteraction: false, // Loại bỏ yêu cầu tương tác để tự động tắt
    };

    // Thêm thông báo vào hàng đợi
    notificationQueue.push({ title: notificationTitle, options: notificationOptions });

    // Xử lý hàng đợi
    if (notificationQueue.length === 1) {
      showNextNotification();
    }
  });
});

function showNextNotification() {
  if (notificationQueue.length === 0) return;

  const { title, options } = notificationQueue.shift();
  self.registration.showNotification(title, options).then(() => {
    // Tự động tắt sau 3 giây và hiển thị thông báo tiếp theo
    setTimeout(() => {
      self.registration.getNotifications().then(notifications => {
        notifications.forEach(n => n.close());
        if (notificationQueue.length > 0) {
          showNextNotification();
        }
      });
    }, 3000); // 3 giây
  });
}

// Xử lý hành động khi nhấp vào thông báo background
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  if (action === 'open') {
    const userId = getUserIdFromCookie();
    const redirectUrl = 'https://your-app.com/detail?userId=' + userId;

    event.waitUntil(
      self.clients.matchAll().then(clients => {
        const isWebOpen = clients.some(client => client.url === location.origin && client.visibilityState !== 'hidden');
        if (isWebOpen) {
          // Nếu web đang mở, gửi thông điệp để redirect trong tab hiện tại
          clients.forEach(client => {
            client.postMessage({ type: 'REDIRECT', url: redirectUrl });
          });
        } else {
          // Nếu web không mở, mở cửa sổ mới
          self.clients.openWindow(redirectUrl);
        }
      })
    );
  }
});

// Lắng nghe thông điệp từ Service Worker trong client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'REDIRECT') {
    // Không cần xử lý ở đây vì redirect sẽ được xử lý ở client
  }
});