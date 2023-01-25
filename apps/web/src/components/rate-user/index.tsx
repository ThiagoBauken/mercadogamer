import { useEffect, useState } from 'react';
import { getFileFullUrl, madeBackgroundImageUrl, setting } from '@utils';
import { useTypedSelector } from '@store';
import { useSocket } from '@web/hooks/use-socket';
import { Modal } from '@widgets/modal';
import { Rating } from '@widgets/rating';
import { Textarea } from '@widgets/textarea';
import { Button } from '@widgets/button';
import router from 'next/router';

type Props = {
  open: boolean;
  order: OrderModelType;
  ratingUser: UserModelType;
  rateContent?: {
    order: string;
    qualified: string;
    roleReviewed: string;
  };
  onClose: () => void;
  onAction?: () => void;
};

const RateUser: React.FC<Props> = (props) => {
  const { open, ratingUser, rateContent } = props;

  const { user } = useTypedSelector((store) => store.auth);

  const { socket } = useSocket();

  const [state, setState] = useState<{ loading: boolean; rate: number; opinion: string }>({
    loading: false,
    rate: 0,
    opinion: '',
  });

  useEffect(() => {
    const closeSocket = (): void => {
      socket?.off(setting.socketEvents.finishOrder);
    };

    if (socket) {
      closeSocket();

      socket.on(setting.socketEvents.finishOrder, () => {
        setState({ ...state, loading: false });
        props.onAction && props.onAction();
        props.onClose && props.onClose();
      });
    }

    return closeSocket;
  }, [socket, user?.id, props.onAction]);

  const sendRate = () => {
    const body = {
      ...rateContent,
      qualification: state.rate,
      body: state.opinion,
      qualifier: user.id,
    };

    socket.emit(setting.socketEvents.finishOrder, body);
    setState({ ...state, loading: true });
  };

  return (
    <Modal
      open={open}
      header="Calificar al vendedor"
      contentClass="rate-user-modal"
      width={450}
      onClose={props.onClose}
    >
      <div className="user-info">
        <div
          className="avatar"
          style={{
            backgroundImage: madeBackgroundImageUrl(
              getFileFullUrl(ratingUser.picture),
              '/assets/imgs/avatar.webp'
            ),
          }}
        ></div>
        <div className="user-name">{ratingUser.username}</div>
        <Rating
          iconSize={30}
          activeIcon="star"
          editable
          rating={state.rate}
          onChange={(rate) => setState({ ...state, rate })}
        />
      </div>

      <Textarea
        label="Compartí tu opinión del vendedor"
        full
        value={state.opinion}
        onChange={(opinion) => setState({ ...state, opinion })}
      />

      <Button
        onClick={sendRate}
        full
        disabled={!state.rate || !state.opinion}
        loading={state.loading}
      >
        Calificar
      </Button>
    </Modal>
  );
};

export default RateUser;
