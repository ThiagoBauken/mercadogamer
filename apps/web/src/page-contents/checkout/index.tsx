// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCarts, payCarts, reloadUser, useAppDispatch, useTypedSelector } from '@store';
import {
  addMessageToToast,
  caculateTime,
  formatInteger,
  getDefaultCountry,
  madeBackgroundImageUrl,
  ProductFunctions,
  setting,
  toUSDandCurrency,
} from '@utils';
import { useForm } from 'react-hook-form';
import { CartCard, ListItem } from './widgets';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSocket } from '@web/hooks/use-socket';





import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import { useTranslation } from 'next-i18next';

let timInterval;

type FormData = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  address: string;
  postalCode: number;
  discountCode: string;
  paymentMethod: string;
  province: string;
  city: string;
};


const Loading = dynamic(() => import('@widgets/loading').then(mod => mod.Loading), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const FormInput = dynamic(() => import('@widgets/form').then(mod => mod.FormInput), { ssr: false });
const FormSelect = dynamic(() => import('@widgets/form').then(mod => mod.FormSelect), { ssr: false });

const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation('checkout');
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { width } = useWindowSize();

  const { socket } = useSocket();

  const [state, setState] = useState<{
    loading: boolean;
    selectPayment: boolean;
    paymentUrl: string;
    userInfo: FormData;
  }>({
    loading: false,
    selectPayment: false,
    paymentUrl: undefined,
    userInfo: {
      address: '',
      country: '',
      discountCode: '',
      emailAddress: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      postalCode: 0,
      paymentMethod: '',
      province: '',
      city: '',
    },
  });

  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minuts: number;
    seconds: number;
  }>({ days: 0, hours: 0, minuts: 0, seconds: 0 });

  const [collapse, setCollapse] = useState(false);

  const {
    auth: { user },
    country: { countries },
    payment: { payments },
    cart: { carts, discount },
  } = useTypedSelector((store) => store);

  useEffect(() => {
    const targetTime = moment().add(5, 'minute');
    timInterval = setInterval(() => caculateRemainTime(targetTime), 1000);
    init();

    socket &&
      socket.on('user-notification', (notification: any) => {
        if (notification.action === 'productPaid') {
          setState({ ...state, loading: false });
          router.push('/purchase');
        }
      });

    return () => {
      socket && socket.emit(setting.socketEvents.stopCheckoutTime, user?.id);
      clearInterval(timInterval);

      setState({
        loading: false,
        selectPayment: false,
        paymentUrl: undefined,
        userInfo: {
          address: '',
          country: '',
          discountCode: '',
          emailAddress: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          postalCode: 0,
          paymentMethod: '',
          province: '',
          city: '',
        },
      });
    };
  }, []);

  const caculateRemainTime = (targetTime): void => {
    const now = moment();
    const remain = targetTime.diff(now);
    setTime(caculateTime(remain > 0 ? remain : 0));

    if (remain < 0) {
      clearInterval(timInterval);
      localStorage.removeItem(setting.storage.startCheckout);
      router.push('/cart');
    }
  };

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('address', user.address);
      setValue('emailAddress', user.emailAddress);
      setValue('phoneNumber', user.phoneNumber);
      setValue('postalCode', user.postalCode);
      setValue('country', user.country);
      setValue('paymentMethod', 'mercadoPago');
      setValue('province', user.province);
      setValue('city', user.city);
    }
  }, [user]);

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {},
  });

  const init = async (): Promise<void> => {
    try {
      setState({ ...state, loading: true });
      dispatch(getCarts());
      setState({ ...state, loading: false });
    } catch (error) {
      setState({ ...state, loading: false });
    }
  };

  const getSubTotal = (): number => {
    let result = 0;
    carts?.data
      ?.filter((cart) => cart.product?.stockProduct)
      ?.forEach((cart) => {
        result += cart.product.price * cart.count;
      });
    return result;
  };

  const getProcessingFee = (): number => {
    let fee = 0;
    const country = getDefaultCountry();
    carts?.data
      ?.filter((cart) => cart.product?.stockProduct)
      ?.forEach((cart) => {
        fee += ProductFunctions.getProductPrice(cart.product) * 0.04 * cart.count;
      });
    const rate = country.processingFee * country.toUSD;
    const result = fee + rate;
    return result;
  };

  const setUserInfo = (userInfo: FormData): void => {
    try {
      // validateFields();
      window.scrollTo({ top: 0 });
      setState({ ...state, userInfo, selectPayment: true });
    } catch (e) {
      console.error(e);
    }
  };

  const validateFields = () => {
    try {
      if (!Number(watch('postalCode'))) {
        throw new Error(t('errors.invalid_postal_code'));
      }

      if (!Number(watch('phoneNumber'))) {
        throw new Error(t('errors.invalid_phone'));
      }
    } catch (e) {
      addMessageToToast(e.message, { status: 'error' });
      throw e;
    }
  };

  const onPayment = async (): Promise<void> => {
    try {
      // validateFields();
      socket.emit(setting.socketEvents.stopCheckoutTime, user?.id);
      const result = await payCarts(discount, state.userInfo);
      addMessageToToast(t('messages.order_success', { count: result?.status?.success }));
      if (result.data) {
        setState({
          ...state,
          paymentUrl: result.data,
        });
        router.push(result.data);
      } else {
        router.push('/purchase');
      }
    } catch (error) {
      addMessageToToast(
        t('errors.order_error'),
        {
          status: 'error',
        }
      );
      console.log(error);
    }
  };

  const watchCountry = watch('country');

  const [provinces, setProvinces] = useState<string[]>([]);
  useEffect(() => {
    const country = watchCountry;

    if (country && countries.length > 0) {
      const provinces = countries.find((c) => c.id === country).provinces;

      if (provinces) {
        setProvinces(provinces);
      }
    }
  }, [watchCountry, countries]);

  return (
    <section className="checkout-page">
      <Loading loading={state.loading} />
      <div className="page-title">
        {t('title')}
        <div className="time-left">
          <p>{t('reserved_for')}</p>{' '}
          <span>{`${formatInteger(time.minuts)}:${formatInteger(time.seconds)}`}</span>
        </div>
      </div>
      <div className="content">
        <div className="controller">
          <div className="title">
            {t('payment.title')}
            {/* {state.selectPayment ? t('payment.title') : t('payment.billing_address')} */}
          </div>

          <div className="select-payment">
            <ul>
              <li
                key="0"
                className={payments[0]?.code === watch('paymentMethod') ? 'active' : ''}
                onClick={() => setValue('paymentMethod', payments[0]?.code)}
              >
                <div
                  className="image-container"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(payments[0]?.img),
                  }}
                ></div>
                <div className="content">
                  <div className="name">{payments[0]?.name}</div>
                  <div className="description">{payments[0]?.description}</div>
                </div>
                <div className="action">
                  <Icon name="check-circle" />
                </div>
              </li>
              {/* {payments
                  .filter((payment) => payment.enabled)
                  .map((payment, index) => (
                    <li
                      key={index}
                      className={payment.code === watch('paymentMethod') ? 'active' : ''}
                      onClick={() => setValue('paymentMethod', payment.code)}
                    >
                      <div className="content">
                        <div className="name">{payment.name}</div>
                        <div className="description">{payment.description}</div>
                      </div>
                      <div className="action">
                        <Icon name="check-circle" />
                      </div>
                    </li>
                  ))} */}
            </ul>
            <div className="action">
              <Button type="submit" onClick={onPayment}>
                {t('payment.proceed_to_payment')}
              </Button>
              {state.paymentUrl && (
                <div>
                  <p>
                    {t('payment.redirect_message')}{' '}
                    <a href={state.paymentUrl}>{t('payment.redirect_link')}</a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {state.selectPayment ? (
            <></>
          ) : (
            <></>
            // <div className="select-payment">
            //   <ul>
            //     <li
            //       key="0"
            //       className={payments[0]?.code === watch('paymentMethod') ? 'active' : ''}
            //       onClick={() => setValue('paymentMethod', payments[0]?.code)}
            //     >
            //       <div
            //         className="image-container"
            //         style={{
            //           backgroundImage: madeBackgroundImageUrl(payments[0]?.img),
            //         }}
            //       ></div>
            //       <div className="content">
            //         <div className="name">{payments[0]?.name}</div>
            //         <div className="description">{payments[0]?.description}</div>
            //       </div>
            //       <div className="action">
            //         <Icon name="check-circle" />
            //       </div>
            //     </li>
            //     {/* {payments
            //       .filter((payment) => payment.enabled)
            //       .map((payment, index) => (
            //         <li
            //           key={index}
            //           className={payment.code === watch('paymentMethod') ? 'active' : ''}
            //           onClick={() => setValue('paymentMethod', payment.code)}
            //         >
            //           <div className="content">
            //             <div className="name">{payment.name}</div>
            //             <div className="description">{payment.description}</div>
            //           </div>
            //           <div className="action">
            //             <Icon name="check-circle" />
            //           </div>
            //         </li>
            //       ))} */}
            //   </ul>
            //   <div className="action">
            //     <Button type="submit" onClick={onPayment}>
            //       Proceder al pago
            //     </Button>
            //     {state.paymentUrl && (
            //       <div>
            //         <p>
            //           Si no sos redirigido automaticamente, hace click{' '}
            //           <a href={state.paymentUrl}>aca</a>
            //         </p>
            //       </div>
            //     )}
            //   </div>
            // </div>

            // <form onSubmit={handleSubmit(setUserInfo)}>
            //   <FormInput
            //     className="fist-name"
            //     label="Nombre"
            //     control={control}
            //     name="firstName"
            //     rules={{ required: 'Este campo es obligatorio' }}
            //     width="100%"
            //   />

            //   <FormInput
            //     className="last-name"
            //     label="Apellido"
            //     control={control}
            //     name="lastName"
            //     rules={{ required: 'Este campo es obligatorio' }}
            //     width="100%"
            //   />

            //   <FormInput
            //     className="identification"
            //     label="DNI"
            //     control={control}
            //     name="identification"
            //     width="100%"
            //   />

            //   <FormInput
            //     className="address"
            //     label="Dirección"
            //     control={control}
            //     name="address"
            //     rules={{ required: 'Este campo es obligatorio' }}
            //     width="100%"
            //   />

            //   <FormInput
            //     className="postal-code"
            //     label="Código postal"
            //     type="number"
            //     control={control}
            //     name="postalCode"
            //     rules={{ required: 'Este campo es obligatorio' }}
            //     width="100%"
            //   />

            //   <FormSelect
            //     className="country"
            //     label="País"
            //     control={control}
            //     rules={{ required: 'Este campo es obligatorio' }}
            //     name="country"
            //     items={countries.map((country) => ({ label: country.name, value: country.id }))}
            //     width="100%"
            //   />

            //   <FormInput
            //     control={control}
            //     name="city"
            //     placeholder="Ciudad"
            //     label="Ciudad"
            //     full
            //     // rules={{
            //     //   required: 'This field is required',
            //     // }}
            //   />

            //   {/* <FormSelect
            //     control={control}
            //     name="province"
            //     placeholder="Seleccionar"
            //     label="Provincia"
            //     items={provinces.map((i) => ({ label: i, value: i }))}
            //     full
            //     rules={{ required: 'Este campo es obligatorio' }}
            //   /> */}

            //   <FormInput
            //     className="phone-number"
            //     label="Teléfono"
            //     control={control}
            //     name="phoneNumber"
            //     width="100%"
            //   />

            //   <FormInput
            //     className="email"
            //     label="E-mail"
            //     control={control}
            //     name="emailAddress"
            //     width="100%"
            //   />
            //   <div className="action">
            //     <Button
            //       type="submit"
            //       // disabled={!carts.data.filter((cart) => cart.product?.stockProduct)?.length}
            //     >
            //       Seleccionar medio de pago
            //     </Button>
            //   </div>
            // </form>
          )}
        </div>

        {state.selectPayment && width < BreakPoints.lg ? (
          ''
        ) : (
          <div className="buy-method">
            <div className="header">{t('delivery.how_to_get')}</div>
            <div className="content">
              <div className="delivery">
                <Icon name="ent-inmediata" />
                <span>{t('delivery.automatic')}</span>
              </div>
              <div className="detail">
                {t('delivery.automatic_desc')}
              </div>
            </div>
            <div className="content">
              <div className="delivery">
                <Icon name="ent-coordinada" />
                <span>{t('delivery.coordinated')}</span>
              </div>
              <div className="detail">
                {t('delivery.coordinated_desc')}
              </div>
            </div>
          </div>
        )}

        <div className="carts">
          {/* <div className="title">{t('review.summary.title')}</div> */}
          <Expansion
            collapse={collapse}
            header={
              <div className="carts-header">
                <div className="label">{collapse ? t('review.view_detail') : t('review.hide')}</div>
                <div className="price">{toUSDandCurrency(getSubTotal() + getProcessingFee())}</div>
              </div>
            }
            hideOnDesktop
            onChangeStatus={(value) => {
              setCollapse(value);
            }}
          >
            <div className="title">{t('review.summary.title')}</div>
            {Array.isArray(carts?.data) &&
              carts.data
                // .filter((cart) => cart.product?.stockProduct)
                .map((cart, index) => <CartCard key={index} {...cart} />)}

            <div className="division"></div>

            <ListItem label={t('review.summary.subtotal')} value={toUSDandCurrency(getSubTotal())} />
            <ListItem label={t('review.summary.processing_fee')} value={toUSDandCurrency(getProcessingFee())} />
            <ListItem label={t('review.summary.gift_balance')} value={`-${toUSDandCurrency(discount)}`} />
            <ListItem
              label={t('review.summary.total')}
              value={toUSDandCurrency(getSubTotal() + getProcessingFee() - discount)}
            />
          </Expansion>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};
