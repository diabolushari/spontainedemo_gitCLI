import { useEffect, useState, useRef } from 'react';

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create connection
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => console.log("WS Connected");
    
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    // Cleanup on unmount
    return () => {
      if (socket.readyState === 1) { // 1 = OPEN
        socket.close();
      }
    };
  }, [url]); // Re-run if URL changes

  const sendMessage = (msg: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  return { messages, sendMessage };
};
