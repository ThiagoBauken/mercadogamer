// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { reloadUser, useAppDispatch, useTypedSelector } from '@store';
import { addMessageToToast, toCurrency, toUSD, undoUSD } from '@utils';
import { CART } from '@action-types';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });





const Input = dynamic(() => import('@widgets/input').then(mod => mod.Input), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

type Props = {
  open: boolean;
  totalValue: number;
  onClose: () => void;
};

const UserDiscountModal: React.FC<Props> = ({ open, totalValue = 0, onClose }) => {
  const { t } = useTranslation('cart');
  const dispatch = useAppDispatch();

  const {
    cart,
    auth: { user },
  } = useTypedSelector((store) => store);

  const [state, setState] = useState<{ discountType: 'balance' | 'coupon'; discount: number }>({
    discount: null,
    discountType: null,
  });

  useEffect(() => {
    setState({ discount: Number(toUSD(cart.discount)), discountType: cart.discountType });
  }, [cart]);

  const avaliableValue = useMemo<number>(
    () => (totalValue <= user.gift + user.balance ? totalValue : user.gift + user.balance),
    [totalValue, user.gift]
  );

  const onChangeBalance = (value: number): void => {
    setState({ ...state, discount: Number(value) });
  };

  const onChangeDiscount = (): void => {
    const discount = Number(state.discount);
    if (discount > totalValue) {
      addMessageToToast(
        `El descuento aplicado no puede ser mayor que el valor del producto (${totalValue.toFixed(
          2
        )})`,
        {
          status: 'error',
        }
      );
      return;
    }

    if (discount > avaliableValue) {
      addMessageToToast(
        `El descuento aplicado no puede ser mayor que tu balance disponible (${avaliableValue})`,
        {
          status: 'error',
        }
      );
      return;
    }

    if (discount < 0) {
      addMessageToToast(`El descuento aplicado debe ser mayor o igual que 0`, {
        status: 'error',
      });
      return;
    }

    dispatch({ type: CART.SET_VALUE, payload: { ...state, discount: undoUSD(state.discount) } });
    onClose();
  };

  return (
    <Modal
      open={open}
      header={t('discount.title')}
      onClose={onClose}
      contentClass="user-discount-modal"
      width={450}
    >
      <div className="label">Elegí un descuento para usar en esta compra</div>
      <div
        className={`card balance-card${state.discountType === 'balance' ? ' active' : ''}`}
        onClick={() =>
          state.discountType !== 'balance' && setState({ ...state, discountType: 'balance' })
        }
      >
        <div className="info">
          <div className="header">
            <div className="title">Balance</div>
            <div className="description">{`${toCurrency(
              Math.round((user?.gift + user?.balance) * 100) / 100
            )} disponibles`}</div>
          </div>
          <div className="action">
            <Icon name="check-circle" />
          </div>
        </div>

        <div className="edit-content">
          <Input
            label={t('discount.how_much')}
            type="number"
            full
            placeholder="0.00"
            value={state.discount ? Number(state.discount.toFixed(2)) : undefined}
            prefixNode="$"
            endfixNode={<div className="avaliable-value">Todo</div>}
            hideSpin
            onChange={onChangeBalance}
            onEndFixClick={() => setState({ ...state, discount: avaliableValue })}
          />
        </div>
      </div>

      <Button full onClick={onChangeDiscount}>
        Aplicar descuento
      </Button>
    </Modal>
  );
};

export default UserDiscountModal;
