import { messaging, getToken, onMessage } from "./firebase";

// Hàm lấy userId từ cookie
const getUserIdFromCookie = () => {
  const name = "userId=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "1"; // Mặc định là 1 nếu không tìm thấy
};

const saveFcmToken = async () => {
  const userId = getUserIdFromCookie();
  try {
    console.log("Bắt đầu lấy fcmToken cho userId:", userId);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Đã được cấp quyền thông báo");
      const token = await getToken(messaging, { 
        vapidKey: "BFYK9ATNlj8Oi5afYLSiM4By8SF8iTi-wTiewtF3lYixTgxp3UQTY1fa0AgPkaFUwfV1trCtYbigyUkvJkkNM9s" 
      });
      console.log("fcmToken:", token);
      const response = await fetch("http://localhost:8080/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, token }),
      });
      if (response.ok) {
        console.log("Đã lưu fcmToken cho userId:", userId);
      } else {
        console.error("Lỗi khi lưu fcmToken:", await response.text());
      }
    } else {
      console.log("Quyền gửi thông báo bị từ chối");
    }
  } catch (error) {
    console.error("Lỗi khi lấy FCM token:", error);
  }
};

// Lắng nghe thông báo foreground và quản lý thứ tự
let currentNotification = null;
let notificationQueue = [];

onMessage(messaging, (payload) => {
  console.log("Thông báo nhận được:", payload);
  const userId = getUserIdFromCookie();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
    image: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
    badge: "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0FQV0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8f55d0a5a99c436438e6469f3c61fd5415adce27/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0%3D--1b8988b96ed4a58d3628eb3340c8b231786ccfc0/Annotation%202025-02-14%20172858.jpg",
    vibrate: [200, 100, 200],
    requireInteraction: false, // Loại bỏ yêu cầu tương tác để tự động tắt
  };

  // Thêm thông báo vào hàng đợi
  notificationQueue.push({ title: notificationTitle, options: notificationOptions });

  // Xử lý hàng đợi
  if (!currentNotification) {
    showNextNotification();
  }
});

function showNextNotification() {
  if (notificationQueue.length === 0) {
    currentNotification = null;
    return;
  }

  const { title, options } = notificationQueue.shift();
  currentNotification = new Notification(title, options);

  // Tự động tắt sau 3 giây và hiển thị thông báo tiếp theo
  setTimeout(() => {
    currentNotification.close();
    currentNotification = null;
    showNextNotification(); // Hiển thị thông báo tiếp theo
  }, 3000); // 3 giây

  currentNotification.onclick = (event) => {
    event.preventDefault();
    const userId = getUserIdFromCookie();
    const redirectUrl = "https://your-app.com/detail?userId=" + userId;

    // Kiểm tra nếu người dùng ở trong web
    if (document.hidden) {
      // Nếu ở chế độ nền, mở cửa sổ mới
      window.open(redirectUrl);
    } else {
      // Nếu ở trong web, redirect trong tab hiện tại
      window.location.href = redirectUrl;
    }
  };
}

export default saveFcmToken;