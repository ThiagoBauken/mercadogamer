import React, { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl, setting } from '@utils';
import { useSocket } from '@web/hooks/use-socket';
import { postFile } from '@utils/file';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import { Input } from '@widgets/input';
// import { Textarea } from '@nextui-org/react';
import { Textmessage } from '@widgets/textmessage';
import { FileSelector } from '@widgets/file-selector';
import { Icon } from '@widgets/icon';
import router from 'next/router';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const OpenImageModal = dynamic(() => import('../../../../../components/open-image/index'));

type Props = {
  orderId: string;
  order: OrderModelType;
  chatUser: UserModelType;
  userConversation: ConversationModelType;
  usersConversationMessages: MessageModelType[];
  adminConversation: ConversationModelType;
  adminConversationMessages: MessageModelType[];
  onChangeChart?: () => void;
};
export const ChatContainer: React.FC<Props> = ({
  orderId,
  order,
  chatUser,
  userConversation,
  adminConversation,
  ...props
}) => {
  const { user } = useTypedSelector((store) => store.auth);

  const { socket } = useSocket();

  const [state, setState] = useState<{
    message: string;
    currentChart: 'user' | 'admin';
    usersConversationMessages: MessageModelType[];
    adminConversationMessages: MessageModelType[];
    imageModal: {
      open: boolean;
      url: string;
    };
  }>({
    message: '',
    currentChart: 'user',
    usersConversationMessages: [],
    adminConversationMessages: [],
    imageModal: {
      open: false,
      url: '',
    },
  });

  useEffect(() => {
    order.status === 'complaint' && setState({ ...state, currentChart: 'admin' });
  }, [order.status]);

  const [usersConversationMessages, setUsersConversationMessages] = useState<MessageModelType[]>(
    []
  );

  const chatContentRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<MessageModelType[]>(usersConversationMessages);

  const conversationId = useMemo<string>(
    () => (state.currentChart === 'admin' ? adminConversation?.id : userConversation?.id),
    [adminConversation, userConversation, state.currentChart]
  );

  useEffect(() => {
    conversationRef.current = usersConversationMessages;
  });

  useEffect(() => {
    props.onChangeChart && props.onChangeChart();
  }, [state.currentChart]);

  useEffect(() => {
    setUsersConversationMessages(
      state.currentChart === 'user'
        ? props.usersConversationMessages
        : props.adminConversationMessages
    );
  }, [props.usersConversationMessages, props.adminConversationMessages, state.currentChart]);

  useEffect(() => {
    scrollBottom();
    usersConversationMessages
      .filter((message) => !message.read)
      .forEach((message) => {
        message.read = true;
        socket.emit(setting.socketEvents.readMessage, message.id);
      });
  }, [usersConversationMessages]);

  useEffect(() => {
    if (socket && userConversation?.id) {
      socket.emit(setting.socketEvents.enterConversation, conversationId);

      socket.off(setting.socketEvents.refreshMessages);

      socket.on(setting.socketEvents.refreshMessages, (message) =>
        receiveNewMessage(message, conversationRef.current)
      );
    }
    return () => {
      socket?.emit(setting.socketEvents.leaveConversation, conversationId);
      socket?.off(setting.socketEvents.refreshMessages);
    };
  }, [socket, conversationId]);

  const scrollBottom = (): void => {
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  };

  const receiveNewMessage = (message: MessageModelType, conversations: MessageModelType[]) => {
    if (message.conversation === conversationId) {
      const _usersConversationMessages = JSON.parse(JSON.stringify(conversations));
      _usersConversationMessages.push(message);
      setUsersConversationMessages(_usersConversationMessages);
    }
  };

  const sendMessage = (): void => {
    if (!state.message || !userConversation.id) {
      return;
    }
    const message = {
      conversation: conversationId,
      body: state.message,
      author: user.id,
      authorName: user.firstName + ' ' + user.lastName,
      notificationTo: chatUser?.id,
      order: orderId,
    };
    const replace_body = message.body.replace(/(?:\r\n|\r|\n)/g, '<br>');
    message.body = replace_body;

    socket.emit(setting.socketEvents.newMessage, message);

    setState({ ...state, message: '' });
  };

  const KeyEventSetting = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      sendMessage();
    } else if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault();
    }
  };

  const checkBody = (body: string): 'image' | 'string' => {
    return /^--image--@/.test(body) ? 'image' : 'string';
  };

  const sendImage = async (newFile: File): Promise<void> => {
    try {
      if (newFile) {
        const file = await postFile(newFile);

        if (file.data?.data?.file) {
          const message = {
            conversation: conversationId,
            body: `--image--@${file.data?.data?.file}`,
            author: user.id,
            authorName: `${user.firstName} ${user.lastName}`,
            notificationTo: userConversation.users?.find((item) => item !== user.id),
            order: orderId,
          };
          socket.emit(setting.socketEvents.newMessage, message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="chat-container">
      <div className={`header${order.status === 'complaint' ? ' multiple' : ''}`}>
        <div
          className={`user-info${state.currentChart === 'user' ? ' active' : ''}`}
          onClick={() => setState({ ...state, currentChart: 'user' })}
        >
          <div
            className="avatar"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                getFileFullUrl(chatUser?.picture),
                '/assets/imgs/avatar.webp'
              ),
            }}
          ></div>
          <div className="name">{chatUser?.username}</div>
        </div>
        {order.status === 'complaint' ? (
          <div
            className={`user-info${state.currentChart === 'admin' ? ' active' : ''}`}
            onClick={() => adminConversation?.id && setState({ ...state, currentChart: 'admin' })}
          >
            <div
              className="avatar"
              style={{
                backgroundImage: madeBackgroundImageUrl('/assets/imgs/support-mg-logo.webp'),
              }}
            ></div>
            <div className="name">Mercado Gamer</div>
          </div>
        ) : (
          <div className="message">Chat con el vendedor</div>
        )}
      </div>
      <div className="chat-content" ref={chatContentRef}>
        {usersConversationMessages.map((message, index) => (
          <React.Fragment key={index}>
            <div className={`message ${message.author?.id === user?.id ? 'sent' : 'received'}`}>
              {message.author?.id !== user?.id && (
                <div
                  className="avatar"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(
                      message.authorName === 'Administrador'
                        ? '/assets/imgs/garantia-mg-logo.webp'
                        : message?.author?.picture
                        ? getFileFullUrl(message?.author?.picture)
                        : '/assets/imgs/avatar.webp'
                    ),
                  }}
                ></div>
              )}
              {checkBody(message.body) === 'image' ? (
                <div className="content">
                  <Image
                    src={getFileFullUrl(message.body.split('@')?.[1])}
                    width={130}
                    height={150}
                    loading="lazy"
                    style={{ cursor: 'pointer' }}
                    unoptimized={true}
                    key={index}
                    alt="attached"
                    onClick={() =>
                      setState({
                        ...state,
                        imageModal: {
                          open: true,
                          url: message.body.split('@')?.[1],
                        },
                      })
                    }
                  />
                </div>
              ) : (
                <div className="content" dangerouslySetInnerHTML={{ __html: message.body }}></div>
              )}
            </div>
            <div
              className={`time-bubble ${
                message.author?.id === user?.id ? 'sent-time' : 'received-time'
              }`}
            >
              {moment(message.createdAt).format('DD [de] MMMM hh:mm')}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="action">
        <Textmessage
          full
          placeholder="Escribir mensaje..."
          disabled={['cancelled', 'finished'].includes(order.status)}
          value={state.message}
          onChange={(value: string) => setState({ ...state, message: value })}
          onKeyup={(event: KeyboardEvent<HTMLInputElement>) => KeyEventSetting(event)}
        />
        <FileSelector
          disableMessage
          disabled={['cancelled', 'finished'].includes(order.status)}
          onChange={sendImage}
          renderButton={
            <div className="link">
              <Icon name="paperclip" />
            </div>
          }
        ></FileSelector>
        <div
          className={`send${['cancelled', 'finished'].includes(order.status) ? ' disabled' : ''}`}
          onClick={sendMessage}
        >
          <Icon name="send" />
        </div>
        <div className="keyevent-hint">Presione Shift + Enter para agregar una nueva línea.</div>
      </div>
      {state.imageModal.open && (
        <OpenImageModal
          url={state.imageModal.url}
          onClose={() =>
            setState({
              ...state,
              imageModal: {
                open: false,
                url: '',
              },
            })
          }
        />
      )}
    </div>
  );
};
