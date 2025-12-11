import { useEffect, useState, useRef } from 'react';

interface Message {
  data?: any;
  type?: 'user' | 'server' | 'error' | 'system';
  timestamp?: number;
}

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WS Connected");
      setConnectionStatus('connected');
    };
    
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { data, type: 'server', timestamp: Date.now() }]);
    };

    socket.onerror = (event: Event) => {
      console.error("WS Error:", event);
      setConnectionStatus('error');
      setMessages((prev) => [
        ...prev, 
        { 
          data: 'Connection error occurred', 
          type: 'error',
          timestamp: Date.now()
        }
      ]);
    };

    socket.onclose = (event: CloseEvent) => {
      console.log(`WS Closed: Code ${event.code}, Reason: ${event.reason}`);
      setConnectionStatus('disconnected');
      
      const closeMessage = event.wasClean 
        ? `Connection closed normally (Code: ${event.code})`
        : `Connection lost unexpectedly (Code: ${event.code})`;
      
      setMessages((prev) => [
        ...prev,
        {
          data: closeMessage,
          type: 'system',
          timestamp: Date.now()
        }
      ]);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = (msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, { data: msg, type: 'user', timestamp: Date.now() }]);
    } else {
      console.warn("Cannot send message: WebSocket is not connected");
      setMessages((prev) => [
        ...prev,
        {
          data: 'Failed to send: Not connected',
          type: 'error',
          timestamp: Date.now()
        }
      ]);
    }
  };

  return { messages, sendMessage, connectionStatus };
};
