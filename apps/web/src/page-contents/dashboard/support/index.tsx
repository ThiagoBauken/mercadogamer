import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTypedSelector } from '@store';
import { endpoints, getFileFullUrl, httpGetAll, madeBackgroundImageUrl } from '@utils';
import moment from 'moment';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';
import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { useRouter } from 'next/router';

const CreateTicketModal = dynamic(() => import('./widgets/create-ticket-modal/index'));

export const SupportPageContent: React.FC = () => {
  const { width } = useWindowSize();

  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  const router = useRouter();

  const [state, setState] = useState<{
    modal: boolean;
    tickets: TicketModelType[];
    selectedTicket: TicketModelType;
    showInformation: boolean;
  }>({
    modal: null,
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
      setState({ ...state, tickets: response.data?.data, modal: false });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className={`support-page-content${state.showInformation ? ' active' : ''}`}>
      <div className="title">
        <div className="label">
          <div className="content">Soporte</div>
          <div className="description">
            Si necesitás ayuda, generá una consulta y te responderemos a la brevedad.
          </div>
        </div>
        <Button
          onClick={() => setState({ ...state, modal: true })}
          kind={width < BreakPoints.lg ? 'round' : 'primary'}
          roundIcon="plus"
        >
          Generar ticket
        </Button>
      </div>
      <div className="content">
        <div className="tickets">
          <div className="title">Tus tickets</div>
          <ul>
            {state.tickets?.map((ticket) => (
              <li
                key={ticket.id}
                className={state.selectedTicket?.id === ticket.id ? 'active' : ''}
                onClick={() =>
                  setState({ ...state, selectedTicket: ticket, showInformation: true })
                }
              >
                <div className="header">
                  <div className="label">{ticket.title}</div>
                  {/* <div className="unread"></div> */}
                  <div className="date">{moment(ticket.createdAt).format('DD/MM/YYYY')}</div>
                </div>
                <div className="content">{ticket.body}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`ticket-information${state.showInformation ? ' active' : ''}`}>
          <div
            className="back-ticket"
            onClick={() => setState({ ...state, showInformation: false })}
          >
            <Icon name="arrow-left" />
            <div className="label">Ticket</div>
          </div>
          <div className="content">
            <div className="title">
              <div
                className="avatar"
                style={{
                  backgroundImage: madeBackgroundImageUrl('/assets/imgs/support-mg-logo.webp'),
                }}
              ></div>
              <div className="title">Mercado Gamer</div>
              <div className="topic">{`Tema: ${state.selectedTicket?.title || ''}`}</div>
            </div>

            <div className="content">
              <div className="row">
                <div className="header">
                  <div
                    className="avatar"
                    style={{
                      backgroundImage: madeBackgroundImageUrl(
                        getFileFullUrl(user?.picture),
                        '/assets/imgs/avatar.webp'
                      ),
                    }}
                  ></div>
                  <div className="user-name">{`${user?.firstName} ${user?.lastName}`}</div>
                  <div className="date">
                    {moment(state.selectedTicket?.createdAt).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className="content">{state.selectedTicket?.body}</div>
              </div>

              {state.selectedTicket?.answer && (
                <React.Fragment>
                  <div className="row">
                    <div className="header">
                      <div
                        className="avatar"
                        style={{
                          backgroundImage: madeBackgroundImageUrl(
                            '/assets/imgs/support-mg-logo.webp'
                          ),
                        }}
                      ></div>
                      <div className="user-name">Mercado Gamer</div>
                      <div className="date">
                        {moment(state.selectedTicket?.updatedAt).format('DD/MM/YYYY')}
                      </div>
                    </div>
                    <div className="content">{state.selectedTicket?.answer}</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      {state.modal && (
        <CreateTicketModal
          open={true}
          onClose={() => setState({ ...state, modal: false })}
          onAction={loadTickets}
        />
      )}
    </section>
  );
};
