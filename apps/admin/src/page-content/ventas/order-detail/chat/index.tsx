import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Textmessage } from '@widgets/textmessage';
import { Icon } from '../../../../../../../libs/ui-shared/src/widgets/icon';
import { FileSelector } from '@widgets/file-selector';
import { ImageWithFallback } from '../../../../../../../libs/ui-shared/src/widgets/image-with-fallback';
import { getFileFullUrl, postFile, setting } from '../../../../../../../libs/ui-shared/src/utils';
import { useSocket } from '../../../../hooks/use-socket';
import moment from 'moment';

interface IProps {
  usersConversation: ConversationModelType;
  sellerConversation: ConversationModelType;
  buyerConversation: ConversationModelType;
  usersConversationMessages: MessageModelType[];
  sellerConversationMessages: MessageModelType[];
  buyerConversationMessages: MessageModelType[];
  order: OrderModelType;
  socket?;
  selectedChat?: ChatsTypes;
  setSelected?;
  addNewMessage: (msg: MessageModelType) => void;
}

enum ChatsTypes {
  BUYER = 'buyer',
  SELLER = 'seller',
  USERS = 'users',
}

export const Chat: React.FC<IProps> = ({
  order,
  socket: passedSocket,
  addNewMessage,
  selectedChat,
  ...rest
}) => {
  const [_selected, _setSelected] = useState<ChatsTypes>(selectedChat || ChatsTypes.BUYER);
  const [messageValue, setMessageValue] = useState('');

  const socket = passedSocket || useSocket().socket;

  const lastItemRef = useRef<HTMLDivElement>(undefined);

  useEffect(() => {
    if (socket) {
      socket.emit(setting.socketEvents.enterConversation, rest.usersConversation.id);

      socket.emit(setting.socketEvents.enterConversation, rest.sellerConversation.id);

      socket.emit(setting.socketEvents.enterConversation, rest.buyerConversation.id);

      socket.on(setting.socketEvents.refreshMessages, addNewMessage);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [_selected]);

  const scrollToBottom = () => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ block: 'nearest', inline: 'start' });
    }
  };

  const setSelected = (arg: ChatsTypes) => {
    if (rest.setSelected) {
      rest.setSelected(arg);
    }

    _setSelected(arg);
  };

  const getMessages = (conversationMessages: MessageModelType[], condition) => {
    return conversationMessages.map((msg) => {
      const cond = condition(msg);
      const classes = 'msg-balloon ' + (cond ? 'left' : 'right');
      const type = checkBody(msg.body);

      const avatarSource =
        msg.author && msg.author.picture
          ? getFileFullUrl(msg.author?.picture)
          : '/assets/imgs/avatar.webp';

      const MsgAvatar = () => (
        <div className="img-container">
          <ImageWithFallback className="msg-avatar" width="40px" height="40px" src={avatarSource} />
        </div>
      );

      if (type === 'string') {
        return (
          <div className={classes}>
            {cond && <MsgAvatar />}
            <div className="msg-content">
              <span className="time">{moment(msg.createdAt).format('DD/MM/YYYY - H:mm')}</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: msg.body,
                }}
              ></span>
            </div>
            {!cond && <MsgAvatar />}
          </div>
        );
      }

      const imgUrl = getFileFullUrl(msg.body.split('@')?.[1]);

      return (
        <div className={classes}>
          {cond && <MsgAvatar />}
          <a target="_blank" href={imgUrl}>
            <ImageWithFallback width={130} height={150} src={imgUrl} />
          </a>
          {!cond && <MsgAvatar />}
        </div>
      );
    });
  };

  const getContent = () => {
    switch (_selected) {
      case ChatsTypes.BUYER:
        return getMessages(rest.buyerConversationMessages, (msg) => msg.author);

      case ChatsTypes.SELLER:
        return getMessages(rest.sellerConversationMessages, (msg) => msg.author);

      case ChatsTypes.USERS:
        return getMessages(
          rest.usersConversationMessages,
          (msg) => msg.author?.id === order.buyer.id
        );
    }
  };

  const getConversation = () => {
    switch (_selected) {
      case ChatsTypes.BUYER:
        return rest.buyerConversation;

      case ChatsTypes.SELLER:
        return rest.sellerConversation;

      case ChatsTypes.USERS:
        return rest.usersConversation;
    }
  };

  const getChatSelectorClass = (type: ChatsTypes) => {
    return 'chat-selector' + (type === _selected ? ' selected' : '');
  };

  const sendMessage = () => {
    const body = messageValue;
    const conversation = getConversation();

    if (!body || body.length === 0 || !conversation.id) {
      return;
    }

    const msg = {
      conversation: conversation.id,
      author: null,
      body,
      authorName: 'Administrator',
      order: order.id,
    };

    msg.body = msg.body.replace(/(?:\r\n|\r|\n)/g, '<br>');

    socket.emit(setting.socketEvents.newMessage, msg);

    setMessageValue('');
  };

  const keyEvent = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
    }
  };

  const checkBody = (body: string): 'image' | 'string' => {
    return /^--image--@/.test(body) ? 'image' : 'string';
  };

  const sendImage = async (newFile: File) => {
    try {
      if (newFile) {
        const file = await postFile(newFile);

        if (file.data?.data?.file) {
          const conversation = getConversation();

          const message = {
            conversation: conversation.id,
            body: `--image--@${file.data?.data?.file}`,
            authorName: `Administrator`,
            order: order.id,
          };
          socket.emit(setting.socketEvents.newMessage, message);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div
          onClick={() => setSelected(ChatsTypes.BUYER)}
          className={getChatSelectorClass(ChatsTypes.BUYER)}
        >
          <ImageWithFallback
            className="avatar"
            src={getFileFullUrl(order.buyer.picture)}
            width={40}
            height={40}
          />
          <span>{order.buyer.username}</span>
        </div>
        <div
          onClick={() => setSelected(ChatsTypes.SELLER)}
          className={getChatSelectorClass(ChatsTypes.SELLER)}
        >
          <ImageWithFallback
            className="avatar"
            src={getFileFullUrl(order.seller.picture)}
            width={40}
            height={40}
          />
          <span>{order.seller.username}</span>
        </div>
        <div
          onClick={() => setSelected(ChatsTypes.USERS)}
          className={getChatSelectorClass(ChatsTypes.USERS)}
        >
          <ImageWithFallback
            className="avatar"
            src={'/assets/imgs/avatar.webp'}
            width={40}
            height={40}
          />
          <span>Usuarios</span>
        </div>
      </div>
      <div className="chat-messages">
        <div className="messages">
          {getContent()}
          <div ref={lastItemRef}></div>
        </div>
        {_selected !== ChatsTypes.USERS && (
          <div className="send-message">
            <Textmessage
              full
              placeholder="Escribir mensaje..."
              disabled={['cancelled', 'finished'].includes(order.status)}
              value={messageValue}
              onChange={(value: string) => setMessageValue(value)}
              onKeyup={(event) => keyEvent(event)}
            />
            <FileSelector
              disableMessage
              disabled={['cancelled', 'finished'].includes(order.status)}
              onChange={sendImage}
              renderButton={
                <div className="link">
                  <Icon color="#73778A" size={26} name="paperclip" />
                </div>
              }
            />
            <div className="send-btn" onClick={sendMessage}>
              <Icon name="send" size={26} color="black" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
