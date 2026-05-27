// @ts-nocheck - TypeScript compatibility fix
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTypedSelector } from '@store';
import { endpoints, getFileFullUrl, httpGetAll, madeBackgroundImageUrl } from '@utils';
import moment from 'moment';


import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const CreateTicketModal = dynamic(() => import('./widgets/create-ticket-modal/index'), { ssr: false });


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const SupportPageContent: React.FC = () => {
  const { t } = useTranslation('dashboard');
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
          <div className="content">{t('support.title')}</div>
          <div className="description">
            {t('support.description')}
          </div>
        </div>
        <Button
          onClick={() => setState({ ...state, modal: true })}
          kind={width < BreakPoints.lg ? 'round' : 'primary'}
          roundIcon="plus"
        >
          {t('support.generate_ticket')}
        </Button>
      </div>
      <div className="content">
        <div className="tickets">
          <div className="title">{t('support.your_tickets')}</div>
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
            <div className="label">{t('support.ticket')}</div>
          </div>
          <div className="content">
            <div className="title">
              <div
                className="avatar"
                style={{
                  backgroundImage: madeBackgroundImageUrl('/assets/imgs/support-mg-logo.webp'),
                }}
              ></div>
              <div className="title">{t('support.company_name')}</div>
              <div className="topic">{t('support.topic', { topic: state.selectedTicket?.title || '' })}</div>
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
                      <div className="user-name">{t('support.company_name')}</div>
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
