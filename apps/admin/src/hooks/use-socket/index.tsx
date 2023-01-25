import { createContext, useState, useEffect, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { useTypedSelector } from '@admin/store';

interface ISocketContext {
  socket: typeof Socket;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});

const SocketContextProvider = (props: ChildrenProps): React.ReactElement => {
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
