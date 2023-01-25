import { useRouter } from 'next/router';
import { openLoginModal, useAppDispatch, useTypedSelector } from '@store';
import { Icon } from '@widgets/icon';
import { Menu } from '@widgets/menu';
import {
  getDefaultCountry,
  getFileFullUrl,
  madeBackgroundImageUrl,
  ProductFunctions,
  toUSDandCurrency,
} from '@utils';
import { useMemo, useState } from 'react';
import { getProductPrice } from '@utils/product-functions';
import { Button } from '@widgets/button';

export const CartMenu: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    auth: { user },
    cart: { carts },
  } = useTypedSelector((store) => store);
  const [openCart, setOpenCart] = useState<boolean>(false);

  const getProcessingFeeTotal = (): number => {
    let fee = 0;
    const country = getDefaultCountry();
    carts?.data?.forEach((cart) => {
      fee += ProductFunctions.getProductPrice(cart.product) * 0.04 * cart.count;
    });
    const rate = country.processingFee * country.toUSD;
    const result = fee + rate;
    return result;
  };

  const total = useMemo<string>(() => {
    let _total = 0;
    carts?.data?.forEach((cart) => {
      _total += cart.count * getProductPrice(cart.product);
    });
    return toUSDandCurrency(_total + getProcessingFeeTotal());
  }, [carts]);

  const loginModal = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!user) {
      event.stopPropagation();
      dispatch(openLoginModal(''));
    }
  };

  return (
    <Menu
      maxHeight="unset"
      open={openCart}
      onChangeOpen={(val) => setOpenCart(val)}
      activator={
        <div className="shopping-cart badge-container" onClick={loginModal}>
          <Icon name="shopping-cart" />
          {carts?.data?.length && user ? <div className="badge"></div> : null}
        </div>
      }
    >
      <div className="carts-menu-container">
        <div className="header">
          <div onClick={() => setOpenCart(false)}>
            <Icon name="left-direction"></Icon>
            Carrito
          </div>
        </div>
        <ul className="content">
          {carts?.data?.length ? (
            carts?.data.map((cart) => (
              <li key={cart.id}>
                <div
                  className="image-container"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(
                      getFileFullUrl(cart.product?.picture),
                      '/assets/imgs/placeholder.svg'
                    ),
                  }}
                ></div>

                <div className="content">
                  <div className="label">{cart.product?.name}</div>
                  <div className="value">{`${cart.count}x${toUSDandCurrency(
                    ProductFunctions.getProductPrice(cart.product)
                  )}`}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="no-cart">
              <div className="image-container"></div>
              <div className="message">Todavía no agregaste productos a al carrito.</div>
            </li>
          )}
        </ul>

        {carts?.data?.length ? (
          <div className="total-action">
            <div className="total">
              <div className="label">Total</div>
              <div className="value">{total}</div>
            </div>

            <Button full onClick={() => router.push('/cart')}>
              Ir al carrito
            </Button>
          </div>
        ) : null}
      </div>
    </Menu>
  );
};
