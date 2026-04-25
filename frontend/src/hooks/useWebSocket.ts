import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { data, isConnected, sendMessage };
};
