import { useTypedSelector } from '@web/store';
import { useRouter } from 'next/router';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface ISocketContext {
  socket: Socket | null;
}

interface ChildrenProps {
  children: ReactNode;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});

const SocketContextProvider = (props: ChildrenProps): React.ReactElement => {
  const router = useRouter();
  const { user } = useTypedSelector((store: any) => store.auth);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Only initialize socket on client-side
    if (typeof window === 'undefined') return;

    const socketUrl = process.env['NEXT_PUBLIC_SOCKET_URL'];
    if (!socketUrl) {
      console.warn('NEXT_PUBLIC_SOCKET_URL is not defined');
      return;
    }

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection error handling
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('reconnect_attempt', () => {
      console.info('Attempting to reconnect to socket...');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.info(`Socket reconnected after ${attemptNumber} attempts`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    socket.connect();
    socket.emit('user-login', user.id);

    const handleNotification = (notification: any) => {
      if (notification.action === 'productPaid') {
        router.push('/purchase');
      }
    };

    socket.on('user-notification', handleNotification);

    // Cleanup function to remove listeners
    return () => {
      socket.off('user-notification', handleNotification);
    };
  }, [user, socket, router]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;

export const useSocket = (): ISocketContext => {
  return useContext<ISocketContext>(SocketContext);
};
