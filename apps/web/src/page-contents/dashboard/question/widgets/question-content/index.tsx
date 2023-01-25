import React, { useState } from 'react';
import { addMessageToToast, endpoints, put, del, post } from '@utils';
import moment from 'moment';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import { Icon } from '@widgets/icon';
import { Textarea } from '@widgets/textarea';
import { Button } from '@widgets/button';

type Props = {
  question: ProductQAModelType;
  onAction: () => void;
};
export const QuestionContent: React.FC<Props> = ({ question, onAction }) => {
  const { width } = useWindowSize();
  const [state, setState] = useState<{ collapse: boolean; answer: string }>({
    collapse: true,
    answer: '',
  });

  const deleteQa = async (): Promise<void> => {
    try {
      await del(`${endpoints.productQAsUrl}/${question?.id}`);

      addMessageToToast('Pregunta eliminada.', {
        status: 'error',
        icon: 'trash',
        actionName: 'DESHACER',
        onAction: async () => {
          await post(`${endpoints.productQAsUrl}/addAgain`, { ...question });
          onAction && onAction();
        },
      });
      onAction && onAction();
    } catch (error) {
      console.log(error);
    }
  };

  const onAnswer = async (): Promise<void> => {
    try {
      if (!state.answer) {
        addMessageToToast('Respuesta eliminada.', {
          status: 'error',
          icon: 'check-circle',
        });
      } else {
        await put<ProductQAModelType, ProductQAModelType>(
          `${endpoints.productQAsUrl}/answer/${question.id}`,
          { answer: state.answer }
        );
        addMessageToToast('Respuesta enviada.', {
          status: 'success',
          icon: 'check-circle',
        });
        onAction && onAction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="question-content">
      {width > BreakPoints.lg ? (
        <div className={`header${state.collapse ? '' : ' active'}`}>
          <div className="message">
            {question.question}
            <span>{moment(question.createdAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
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
      ) : (
        <div className={`header${state.collapse ? '' : ' active'}`}>
          <div className="message">
            {question.question}
            <div className="open">
              {!question.answer && <div className="unread"></div>}
              <div
                className="expand action"
                onClick={() => setState({ ...state, collapse: !state.collapse })}
              >
                <Icon name="chevron-down" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!state.collapse && (
        <div className="answer">
          {question.answer ? (
            <div className="date-remove">
              {width > BreakPoints.lg ? null : (
                <div className="remove">
                  <div className="date">
                    {moment(question.createdAt).format('DD/MM/YYYY HH:mm')}
                  </div>
                  <div className="action">
                    <div className="trash action" onClick={deleteQa}>
                      <Icon name="trash" />
                    </div>
                    <div onClick={deleteQa}>Eliminar</div>
                  </div>
                </div>
              )}
              <div className="view-answer">{question.answer}</div>
            </div>
          ) : (
            <div className="edit-answer">
              <div className="date-remove">
                {width > BreakPoints.lg ? null : (
                  <div className="remove">
                    <div className="date">
                      {moment(question.createdAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                    <div className="action">
                      <div className="trash action" onClick={deleteQa}>
                        <Icon name="trash" />
                      </div>
                      <div onClick={deleteQa}>Eliminar</div>
                    </div>
                  </div>
                )}
                <div className="view-answer">{question.answer}</div>
              </div>
              <Textarea
                full
                value={state.answer}
                placeholder="Escribí acá tu respuesta"
                onChange={(value) => setState({ ...state, answer: value })}
              />
              <div className="action">
                <Button onClick={onAnswer}>Responder</Button>
                <Button kind="no-color" onClick={() => setState({ ...state, answer: '' })}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
