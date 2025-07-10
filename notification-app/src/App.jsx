import { useEffect } from "react";
import saveFcmToken from "./firebase/fcm";
import DateRangeForm from './components/DateRangeForm';
import StatisticsChart from './components/ChartData';


function App() {
  // useEffect(() => {
  //   // Giả sử userId lấy từ state, context, hoặc sau khi đăng nhập
  //   const userIds = [1, 2, 3, 4, 5]; // Thay bằng danh sách userId thực tế
  //   userIds.forEach((userId) => {
  //     console.log("Gọi saveFcmToken cho userId:", userId);
  //     saveFcmToken(userId);
  //   });
  // }, []);

  // return (
  //   <div>
  //     <h1>Reservation App</h1>
  //     <p>Check console for FCM token status</p>
  //   </div>
  // );

  return (
    <div className="App">
      <StatisticsChart />
    </div>
  );
}

export default App;