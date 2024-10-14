import { useEffect, useState } from "react";

const useWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const ws = new WebSocket('wss://your-backend-url.com/ws');
  
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('Error:', data.error);
        } else if (data.content === '[DONE]') {
          console.log(`${data.type} response completed`);
        } else {
          setMessages(prev => [...prev, data]);
        }
      };
  
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      };
  
      setSocket(ws);
  
      return () => {
        ws.close();
      };
    }, []);
  
    const sendMessage = (type, prompt) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, prompt }));
      }
    };
  
    return { sendMessage, messages };
  };
  