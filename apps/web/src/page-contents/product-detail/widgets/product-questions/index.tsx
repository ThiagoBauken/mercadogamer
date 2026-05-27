// @ts-nocheck - TypeScript compatibility fix
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import moment from 'moment';
import { endpoints, httpGetAll, post, addMessageToToast } from '@utils';
import { login, openLoginModal, useAppDispatch, useTypedSelector } from '@store';



import { useTranslation } from 'next-i18next';

const RenderQA: React.FC<ProductQAModelType & { t: any }> = (props) => (
  <li className="qa-items">
    <div className="question">{props.question}</div>
    <div className="answer">
      {props.answer ? props.answer : props.t('questions.no_answer')}
      <span>{moment(props.updatedAt).format('DD/MM/YYYY')}</span>
    </div>
  </li>
);


const Input = dynamic(() => import('@widgets/input').then(mod => mod.Input), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const ProductQuestions: React.FC<{ value: ProductModelType }> = ({ value }) => {
  const { t } = useTranslation('products');
  const dispatch = useAppDispatch();

  const [qas, setQAs] = useState<ProductQAModelType[]>([]);
  const [i, setMore] = useState<number>(1);
  const [question, setQuestion] = useState<number | string>();
  const [my_questions, setFilterMyQuestions] = useState<number[] | string[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const user = useTypedSelector((state) => state.auth.user);
  // const product = value;
  useEffect(() => {
    loadProductQAs();
  }, [id]);

  const loadProductQAs = async (): Promise<void> => {
    try {
      const response = await httpGetAll(`${endpoints.productQAsUrl}`, {
        filter: { product: id },
      });

      const filter_my_questions = response.data.data.filter((item) => item.buyer == user?.id);
      setFilterMyQuestions(filter_my_questions);

      setQAs(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterMyQuestions = async (): Promise<void> => {
    try {
      const response = await httpGetAll(`${endpoints.productQAsUrl}`, {
        filter: { product: id },
      });
      if (!user) {
        dispatch;
      }
      const alldata = response.data.data;
      const qa_filters = alldata.filter((item) => item.buyer == user?.id);

      setQAs(qa_filters);
    } catch (error) {
      console.log(error);
    }
  };

  const sendQuestion = async (): Promise<void> => {
    try {
      if (!question) {
        addMessageToToast(t('questions.empty_question_error'), {
          icon: 'alert-triangle',
          status: 'error',
        });
      } else {
        const item = {
          question: question,
          buyer: user.id,
          seller: value.user?.id,
          product: value.id,
        };

        const result = await post(endpoints.productQAsUrl, item);
        loadProductQAs();
        setQuestion('');
        addMessageToToast(t('questions.question_sent_success'), {
          icon: 'check-circle',
          status: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toLogin = () => {
    dispatch(openLoginModal());
  };

  const questionJSX = (
    <div className="content">
      <Input
        placeholder={t('questions.write_question_placeholder')}
        width="100%"
        value={question}
        onChange={(value) => setQuestion(value)}
      />
      <Button kind="secondary" onClick={() => sendQuestion()}>
        {t('questions.ask_button')}
      </Button>
    </div>
  );

  const loginJSX = (
    <div className="unlogged-question">
      <span onClick={() => toLogin()}>{t('questions.sign_in')}</span> {t('questions.login_to_ask')}
    </div>
  );

  return (
    <div className="product-questions">
      <div className="add-question">
        <div className="label">{t('questions.title')}</div>
        {user ? (user.id !== value.user?.id && questionJSX) : loginJSX}
      </div>
      {my_questions.length != 0 ? (
        <div className="qa-title" onClick={filterMyQuestions}>
          {t('questions.your_question')}
        </div>
      ) : null}
      <ul className="qa-content">
        {Array.isArray(qas) &&
          qas.slice(0, i * 4).map((qa, index) => <RenderQA key={index} {...qa} t={t} />)}
      </ul>
      {qas.length >= 5 ? (
        <div className="more-btn" onClick={() => setMore(i + 1)}>
          <span>
            <Icon name="more-detail" />
          </span>
          {t('questions.load_more')}
        </div>
      ) : null}
    </div>
  );
};
