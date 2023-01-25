import { useState } from 'react';
import { Icon } from '@widgets/icon';
import { addMessageToToast, del, endpoints } from '@utils';
import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import moment from 'moment';

type Props = {
  qas: ProductQAModelType;
  onDelete: () => void;
};
export const QasContent: React.FC<Props> = ({ qas, onDelete }) => {
  const { width } = useWindowSize();
  const [state, setState] = useState<{ collapse: boolean }>({ collapse: true });
  const deleteQa = async (): Promise<void> => {
    try {
      await del(`${endpoints.productQAsUrl}/${qas?.id}`);
      addMessageToToast('Pregunta eliminada.', {
        status: 'error',
        icon: 'trash',
        actionName: 'DESHACER',
      });
      onDelete && onDelete();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="qas-content">
      <div className="header">
        <div className="message">{qas.question}</div>
        <div className="action">
          {/* <div className="unread"></div> */}
          {width > BreakPoints.lg ? (
            <div className="trash action" onClick={deleteQa}>
              <Icon name="trash" />
            </div>
          ) : null}

          <div
            className="expand action"
            onClick={() => setState({ ...state, collapse: !state.collapse })}
          >
            <Icon name="chevron-down" />
          </div>
        </div>
      </div>

      {!state.collapse && (
        <div className="answer">
          {width > BreakPoints.lg ? (
            <div></div>
          ) : (
            <div className="action">
              <div className="date">{moment(qas.updatedAt).format('DD/MM/YYYY HH:MM')}</div>
              <div className="trash action" onClick={deleteQa}>
                <Icon name="trash" />
                <div>Eliminar</div>
              </div>
            </div>
          )}
          {qas.answer || 'Todavía no has recibido una respuesta'}
        </div>
      )}
    </div>
  );
};
