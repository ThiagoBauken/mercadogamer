// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getPaymentMethods, reloadUser, useAppDispatch, useTypedSelector } from '@store';
import { useForm } from 'react-hook-form';
import {
  addMessageToToast,
  endpoints,
  get,
  getFileFullUrl,
  httpGetAll,
  post,
  toCurrency,
} from '@utils';
import { RouletteKind } from '../../gift/constanst';


import Image from 'next/image';
import { useTranslation } from 'next-i18next';
const WithDrawalAmount = dynamic(() => import('./widgets/withdrawal-amount/index'), { ssr: false });
const BalanceCard = dynamic(() => import('./widgets/card/index'), { ssr: false });
const InputCBUCVU = dynamic(() => import('./widgets/cbu-cvu/index'), { ssr: false });
const WithdrawalConfirm = dynamic(() => import('./widgets/confirm/index'), { ssr: false });
const WithDrawalPayment = dynamic(() => import('./widgets/select-payment/index'), { ssr: false });
const WithdrawalSuccess = dynamic(() => import('./widgets/success/index'), { ssr: false });


const Input = dynamic(() => import('@widgets/input').then(mod => mod.Input), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const BalancePageContent: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const dispatch = useAppDispatch();

  const {
    auth: { user },
    paymentMethod: { paymentMethods },
  } = useTypedSelector((store) => store);
  const [state, setState] = useState<{
    loading: boolean;
    modal: 'amount' | 'payment' | 'input-cbu-cvu' | 'confirm' | 'success';
    roulleteTransaction: RouletteTransactionModelType;
  }>({
    loading: false,
    modal: null,
    roulleteTransaction: {},
  });
  const [giftValue, setGiftValue] = useState(null);

  const formController = useForm<
    WithDrawalModelType & { paymentMethod: string; userInfo: string; taxId: string }
  >();

  const { handleSubmit, watch } = formController;

  useEffect(() => {
    if (user?.id) {
      dispatch(getPaymentMethods());
      dispatch(reloadUser());
      loadRoulleteTransaction();
    }
  }, [user?.id]);

  const loadRoulleteTransaction = async (): Promise<void> => {
    try {
      const roulleteTransaction = await get(`${endpoints.rouletteTransactionUrl}/today`);
      setState({ ...state, roulleteTransaction: roulleteTransaction.data || {} });
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseModal = () => setState({ ...state, modal: null });

  const onSubmit = async (
    data: WithDrawalModelType & {
      paymentMethod: string;
      userInfo: string;
      taxId: string;
    }
  ): Promise<void> => {
    try {
      const paymentMethod = paymentMethods.find((item) => item.type === data.paymentMethod)?.id;

      await post(`${endpoints.withdrawalUrl}/create`, { ...data, paymentMethod });
      setState({ ...state, modal: 'success' });
      dispatch(reloadUser());
    } catch (error) {
      console.log(error);
    }
  };

  const getGiftBalance = async (): Promise<void> => {
    try {
      if (!user?.id) return;
      if (!giftValue) {
        addMessageToToast(
          t('balance.empty_code_error'),
          {
            icon: 'alert-triangle',
            status: 'error',
          }
        );
      } else {
        setState({ ...state, loading: true });
        await httpGetAll(`${endpoints.discountCodesUrl}/check/${giftValue}`);

        addMessageToToast(t('balance.gift_success'), {
          icon: 'check-circle',
          status: 'success',
        });
        setState({ ...state, loading: false });
        dispatch(reloadUser());
      }
    } catch (error) {}
  };

  const hasRequiredData = () => {
    const properties = [
      'firstName',
      'lastName',
      'emailAddress',
      'phoneNumber',
      'city',
      'province',
      'address',
      'postalCode',
    ];

    for (const property of properties) {
      if (!(property in user) || !user[property]) {
        return false;
      }
    }

    return true;
  };

  return (
    <section className="balance-page-content">
      <div className="title">{t('balance.title')}</div>
      <div className="content">
        <div className="balance-total card">
          <div className="title">{t('balance.total_balance')}</div>
          <div className="content">
            <div className="description">
              {t('balance.total_balance_description')}
            </div>
            <div className="balance">
              {toCurrency(Math.round((user?.balance + user?.gift) * 100) / 100)}
            </div>
          </div>
        </div>
        <BalanceCard
          title={t('balance.withdraw_title')}
          helper={t('balance.withdraw_helper')}
          value={user?.balance}
          description={t('balance.withdraw_available')}
          hasRequiredData={hasRequiredData()}
          button={{
            children: t('balance.withdraw_button'),
            disabled: !user || user.balance <= 0 || !hasRequiredData(),
            onClick: () => {
              setState({ ...state, modal: 'amount' });
            },
          }}
        />
        <div className="redeem card">
          <div className="title">{t('balance.redeem_voucher')}</div>
          <div className="content">
            <div className="description">
              {t('balance.redeem_description')}
            </div>
            <div className="code">
              <Input value={giftValue} full onChange={(val) => setGiftValue(val)} />
              <div className="copy-clipboard" onClick={getGiftBalance}>
                <Icon name="check-circle" />
              </div>
            </div>
          </div>
        </div>
        <div className="coupon card">
          <div className="title">{t('balance.coupons')}</div>
          <div className="content">
            <div className="main">
              <div className="name">
                {state.roulleteTransaction?.roullete == '0' ? (
                  RouletteKind.find((item) => item.key === state.roulleteTransaction?.roullete)
                    ?.label
                ) : (
                  <div></div>
                )}
              </div>
              <div className="description">
                {state.roulleteTransaction?.roullete == '0' ? (
                  <div className="got">{t('balance.coupon_use_next_purchase')}</div>
                ) : (
                  <div className="null">
                    {t('balance.no_coupons')}
                  </div>
                )}
              </div>
              {state.roulleteTransaction?.roullete == '0' ? (
                <div className="deadline">
                  <Icon name="alert-triangle" size={20} />
                  <div>{t('balance.expires_in_days', { count: 1 })}</div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <Image
              layout="fixed"
              loading="lazy"
              unoptimized={true}
              alt="homepage banner"
              width={100}
              height={100}
              src={'/assets/imgs/illustration/coupon.webp'}
            />
            {/* {state.roulleteTransaction?.roullete ? (
              <div
                className="image-container"
                style={{
                  backgroundImage: madeBackgroundImageUrl(
                    RouletteKind.find((item) => item.key === state.roulleteTransaction?.roullete)
                      ?.image
                  ),
                }}
              ></div>
            ) : (
              <div
                className="image-container"
                style={{
                  backgroundImage: `url('/assets/imgs/illustration/coupon.webp')`,
                }}
              ></div>
            )} */}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {state.modal === 'amount' && (
          <WithDrawalAmount
            open={state.modal === 'amount'}
            formController={formController}
            button={{
              children: t('balance.next_button'),
              full: true,
              disabled: !watch('amount'),
              onClick: () => setState({ ...state, modal: 'payment' }),
            }}
            onClose={onCloseModal}
          ></WithDrawalAmount>
        )}

        <WithDrawalPayment
          open={state.modal === 'payment'}
          formController={formController}
          button={{
            children: t('balance.next_button'),
            full: true,
            disabled: !watch('paymentMethod'),
            onClick: () => setState({ ...state, modal: 'input-cbu-cvu' }),
          }}
          onClose={onCloseModal}
        ></WithDrawalPayment>

        <InputCBUCVU
          open={state.modal === 'input-cbu-cvu'}
          formController={formController}
          button={{
            children: t('balance.next_button'),
            full: true,
            disabled: !watch('userInfo') || !watch('taxId'),
            onClick: () => setState({ ...state, modal: 'confirm' }),
          }}
          onClose={onCloseModal}
        ></InputCBUCVU>

        <WithdrawalConfirm
          open={state.modal === 'confirm'}
          formController={formController}
          button={{ children: t('balance.confirm_button'), full: true, type: 'submit' }}
          onClose={onCloseModal}
        ></WithdrawalConfirm>

        <WithdrawalSuccess
          open={state.modal === 'success'}
          formController={formController}
          button={{ children: t('balance.done_button'), full: true, onClick: onCloseModal }}
          onClose={onCloseModal}
        ></WithdrawalSuccess>
      </form>
    </section>
  );
};
