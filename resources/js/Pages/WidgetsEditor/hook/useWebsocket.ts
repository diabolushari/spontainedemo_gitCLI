import { useEffect, useState, useRef } from 'react';

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string | null>(null);

  useEffect(() => {
    // Create connection
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus(true);
      if (messageQueue.current) {
        console.log("WS Sending queued message:", messageQueue.current);
        socket.send(JSON.stringify(messageQueue.current));
        messageQueue.current = null;
      }
    };

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("WS Received:", data);
      setMessages((prev) => [...prev, data]);
    };


    socket.onclose = () => {
      setMessages((prev) => [...prev, { type: 'error' }]);
      setConnectionStatus(false)
    };

    // Cleanup on unmount
    return () => {
      if (socket.readyState === 1) { // 1 = OPEN
        socket.close();
      }
    };
  }, [url]); // Re-run if URL changes

  const sendMessage = (msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WS Sending:", msg);
      socketRef.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, { type: 'user', ...msg }]);
    } else {
      if (!messageQueue.current) {
        console.log("WS Not Connected, queuing message : ", msg);
        messageQueue.current = msg;
        setMessages((prev) => [...prev, { type: 'user', ...msg }]);
      }
    }
  };

  return { messages, sendMessage, connectionStatus };
};
