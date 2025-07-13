import { useEffect } from "react";
import saveFcmToken from "./firebase/fcm";
import StatisticsChart from './components/ChartData';

function App() {
  useEffect(() => {
    // Đăng ký Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Gọi saveFcmToken dựa trên userId từ cookie
    console.log("Gọi saveFcmToken với userId từ cookie");
    saveFcmToken();
  }, []);

  return (
    <div className="App">
      <h1>Reservation App</h1>
      <p>Check console for FCM token status. Set cookie 'userId' to test different users.</p>
      <StatisticsChart />
    </div>
  );
}

export default App;