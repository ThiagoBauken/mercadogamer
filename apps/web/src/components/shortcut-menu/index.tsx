import { endpoints, httpGetAll } from '@utils';
import { login, openLoginModal, useAppDispatch, useTypedSelector } from '@web/store';
import { Icon } from '@widgets/icon';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CreateTicketModal = dynamic(
  () => import('@web/page-contents/dashboard/support/widgets/create-ticket-modal/index')
);
const CreateFeedbackModal = dynamic(() => import('../create-feedback/index'));

type Props = {
  onClick?: () => void;
};

export const ShortCutMenu: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((store) => store.auth);
  const router = useRouter();

  const [state, setState] = useState<{
    ticketmodal: boolean;
    feedbackmodal: boolean;
    tickets: TicketModelType[];
    selectedTicket: TicketModelType;
    showInformation: boolean;
  }>({
    ticketmodal: null,
    feedbackmodal: null,
    tickets: [],
    selectedTicket: {},
    showInformation: false,
  });

  useEffect(() => {
    user?.id && loadTickets();
  }, [user?.id]);

  const loadTickets = async (): Promise<void> => {
    try {
      const response = await httpGetAll<TicketModelType>(endpoints.ticketUrl, {
        filter: { user: user.id },
        sort: { updatedAt: -1 },
      });
      setState({ ...state, tickets: response.data?.data, ticketmodal: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="menu-container">
      <div className="content">
        <ul>
          <li onClick={() => router.push('/help-center')}>
            <Icon name="help-circle" />
            Centro de ayuda
          </li>
          <li
            onClick={() =>
              user?.id ? setState({ ...state, feedbackmodal: true }) : dispatch(openLoginModal())
            }
          >
            <Icon name="mail" />
            Enviar feedback
          </li>
          <li
            onClick={() =>
              user?.id ? setState({ ...state, ticketmodal: true }) : dispatch(openLoginModal())
            }
          >
            <Icon name="message-sequare" />
            Enviar consulta
          </li>
        </ul>
      </div>
      {state.ticketmodal && (
        <CreateTicketModal
          open={true}
          onClose={() => setState({ ...state, ticketmodal: false })}
          onAction={loadTickets}
        />
      )}
      {state.feedbackmodal && (
        <CreateFeedbackModal
          open={true}
          onClose={() => setState({ ...state, feedbackmodal: false })}
        />
      )}
    </div>
  );
};
