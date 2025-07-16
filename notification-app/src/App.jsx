import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const App = () => {
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Thay bằng user ID thực tế (lấy từ auth context hoặc API)
    const currentUserId = '1'; // Ví dụ: User ID cứng
    setUserId(currentUserId);

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        'user-id': currentUserId,
      },
      debug: (str) => console.log('[STOMP Debug]:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);
      console.log('[WebSocket] Connected:', frame);
      client.subscribe(`/user/${currentUserId}/notification`, (message) => {
        console.log('[WebSocket] Received message:', message.body);
        try {
          const messages = JSON.parse(message.body);
          // Kiểm tra xem messages có phải là mảng không
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.info(msg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            });
          } else {
            console.error('[WebSocket] Received data is not an array:', messages);
            // Hiển thị thông báo nếu là chuỗi đơn lẻ
            toast.info(messages, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      });
    };

    client.onWebSocketError = (error) => {
      console.error('[WebSocket] WebSocket error:', error);
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('[WebSocket] STOMP error:', frame.headers['message'], frame);
      setIsConnected(false);
    };

    client.onWebSocketClose = (event) => {
      console.log('[WebSocket] Connection closed:', event);
      setIsConnected(false);
    };

    client.activate();

    return () => {
      client.deactivate();
      console.log('[WebSocket] Disconnected');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Notification App</h1>
        <p className="text-gray-700">
          {isConnected ? `Đã kết nối với User ${userId}` : 'Đang kết nối WebSocket...'}
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;