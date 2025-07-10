import { messaging, getToken, onMessage } from "./firebase";

const saveFcmToken = async (userId) => {
  try {
    console.log("Bắt đầu lấy fcmToken cho userId:", userId);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Đã được cấp quyền thông báo");
      const token = await getToken(messaging, { vapidKey: "BFYK9ATNlj8Oi5afYLSiM4By8SF8iTi-wTiewtF3lYixTgxp3UQTY1fa0AgPkaFUwfV1trCtYbigyUkvJkkNM9s" });
      console.log("fcmToken:", token);
      const response = await fetch("http://localhost:8080/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.toString(), token }),
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

// Lắng nghe thông báo foreground
onMessage(messaging, (payload) => {
  console.log("Thông báo nhận được:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/favicon.ico",
    data: payload.data,
  };

  new Notification(notificationTitle, notificationOptions);
});

export default saveFcmToken;