import { useTypedSelector } from '@web/store';
import { useRouter } from 'next/router';
import { createContext, useState, useEffect, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

interface ISocketContext {
  socket: typeof Socket;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});

const SocketContextProvider = (props: ChildrenProps): React.ReactElement => {
  const router = useRouter();

  const { user } = useTypedSelector((store: any) => store.auth);

  const [socket, setSocket] = useState<typeof Socket>(null);

  useEffect(() => {
    const newSocket = io(process.env['NEXT_PUBLIC_SOCKET_URL']);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    if (socket && user) {
      socket.connect();
      socket.emit('user-login', user.id);
      socket.on('user-notification', (notification: any) => {
        if (notification.action === 'productPaid') {
          router.push('/purchase');
        }
      });
    }
  }, [user, socket]);

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
