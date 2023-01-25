import { useState } from 'react';
import { Icon } from '@widgets/icon';
import { addMessageToToast, del, endpoints } from '@utils';

type Props = {
  qas: ProductQAModelType;
  onDelete: () => void;
};
export const ProductContent: React.FC<Props> = ({ qas, onDelete }) => {
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
          <div className="trash action" onClick={deleteQa}>
            <Icon name="trash" />
          </div>
          <div
            className="expand action"
            onClick={() => setState({ ...state, collapse: !state.collapse })}
          >
            <Icon name="chevron-down" />
          </div>
        </div>
      </div>
      {!state.collapse && <div className="answer">{qas.answer || 'No Answer'}</div>}
    </div>
  );
};
