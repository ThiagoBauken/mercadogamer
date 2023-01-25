import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  addCart,
  getCarts,
  reloadUser,
  removeCarts,
  useAppDispatch,
  useTypedSelector,
} from '@store';
import {
  addMessageToToast,
  endpoints,
  getDefaultCountry,
  getFileFullUrl,
  ProductFunctions,
  put,
  setting,
  toUSD,
  toUSDandCurrency,
} from '@utils';
import { ThemeColor } from '@theme/color';
import { useSocket } from '@web/hooks/use-socket';
import { Loading } from '@widgets/loading';
import { Icon } from '@widgets/icon';
import { Input } from '@widgets/input';
import { IconButton } from '@widgets/icon-button';
import Tooltip from '@widgets/tooltip';
import { Button } from '@widgets/button';
import { RelatedProductCart } from '@components/related-product-cart';
import { CART } from '@action-types';
import { count } from 'console';
import { ShortCutMenu } from '@web/components/shortcut-menu';

const UserDiscountModal = dynamic(() => import('./widgets/user-discount/index'));
const ConfirmRemoveAll = dynamic(() => import('./widgets/confirm-remove-all/index'));

export const CartPageContent: React.FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { socket } = useSocket();

  const {
    auth: { user },
    cart: { discount, carts },
  } = useTypedSelector((store) => store);

  const [state, setState] = useState<{
    loading: boolean;
    modal: { name: string };
  }>({ loading: false, modal: { name: '' } });

  const [activeShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async (): Promise<void> => {
    dispatch(reloadUser());
    try {
      setState({ ...state, loading: true });
      await dispatch(getCarts());
      dispatch({ type: CART.SET_VALUE, payload: { ...state, discount: 0 } });
      setState({ loading: false, modal: { name: '' } });
    } catch (error) {
      setState({ loading: false, modal: { name: '' } });
    }
  };

  const getSubTotal = (): number => {
    let result = 0;
    carts?.data
      // ?.filter((cart) => cart.product?.stockProduct)
      ?.forEach((cart) => {
        result += cart.product.price * cart.count;
      });
    return result;
  };

  const getProcessingFee = (product: ProductModelType): number => {
    const country = getDefaultCountry();
    return (
      (ProductFunctions.getProductPrice(product) / 100) * 4 + country.processingFee * country.toUSD
    );
  };

  const getProcessingFeeTotal = (): number => {
    let fee = 0;
    const country = getDefaultCountry();
    carts?.data
      // ?.filter((cart) => cart.product?.stockProduct)
      ?.forEach((cart) => {
        fee += ProductFunctions.getProductPrice(cart.product) * 0.04 * cart.count;
      });
    const rate = country.processingFee * country.toUSD;
    const result = fee + rate;
    return result;
  };

  const onChangeCount = async (value: number, cart: CartModelType): Promise<void> => {
    try {
      setState({ ...state, loading: true });
      if (value <= cart.product?.stock && value > 0) {
        await put(`${endpoints.cartUrl}/${cart.id}`, { count: value });
        cart.count = value;
      }
      setState({ ...state, loading: false });
    } catch (error) {
      setState({ ...state, loading: false });
    }
  };

  const unRemoveCart = async (productId: string): Promise<void> => {
    await addCart(productId, 1, false);
    init();
  };

  const onRemoveCart = async (cart: CartModelType): Promise<void> => {
    setState({ ...state, loading: true });
    try {
      await removeCarts(cart.id);
      init();
      addMessageToToast('Producto eliminado del carrito.', {
        icon: 'trash',
        status: 'error',
        actionName: 'DESHACER',
        onAction: () => unRemoveCart(cart.product.id),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onEmptyCart = async (): Promise<void> => {
    setState({ ...state, loading: true });
    try {
      for (const cart of carts?.data) {
        await removeCarts(cart.id);
      }

      init();
    } catch (error) {
      console.log(error);
    }
  };

  const gotoCheckout = (): void => {
    socket.emit(setting.socketEvents.startCheckout, user?.id);
    !localStorage.getItem(setting.storage.startCheckout) &&
      localStorage.setItem(setting.storage.startCheckout, JSON.stringify(Date.now()));
    router.push('/checkout');
  };

  return (
    <section className="cart-page-content">
      <Loading loading={state.loading} />
      <div className="page-title">Carrito</div>
      <div className="content">
        {carts?.data?.length ? (
          <div className="cart-list">
            <table className="pc-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Artículo</th>
                  <th></th>
                  <th>Precio</th>
                  <th>Cant</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carts?.data
                  ?.filter((cart) => cart.product)
                  .map((cart, index) => (
                    <tr key={index} className={!cart.product.stock ? 'no-stock' : ''}>
                      <td className="fit-content">
                        <div
                          className="image-container"
                          style={{
                            backgroundImage: `url('${getFileFullUrl(cart.product?.picture)}')`,
                          }}
                        ></div>
                      </td>
                      <td className="title">{cart.product?.name}</td>
                      {cart.product.stock || cart.product?.stockProduct ? (
                        <React.Fragment>
                          <td className="delivery fit-content">
                            <Icon
                              size={18}
                              name={
                                !Array.isArray(cart.product?.stockProduct) &&
                                cart.product?.stockProduct?.retirementType === 'automatic'
                                  ? 'ent-inmediata'
                                  : 'ent-coordinada'
                              }
                            />
                          </td>
                          <td className="price">
                            <div className="price">
                              {toUSDandCurrency(ProductFunctions.getProductPrice(cart.product))}
                            </div>
                          </td>
                          <td className="count fit-content">
                            <Input
                              width={90}
                              type="number"
                              value={cart.count}
                              onChange={(value) => onChangeCount(Number(value), cart)}
                            />
                          </td>
                          <td className="total fit-content">
                            {toUSDandCurrency(
                              ProductFunctions.getProductPrice(cart.product) * cart.count
                            )}
                          </td>
                        </React.Fragment>
                      ) : (
                        <td className="no-stock" colSpan={4}>
                          <div className="content">
                            <Icon name="alert-triangle" size={24} />
                            <div>Producto actualmente sin stock.</div>
                          </div>
                        </td>
                      )}
                      <td className="action fit-content">
                        <IconButton
                          icon="trash"
                          color={ThemeColor['gray-80']}
                          hoverColor={ThemeColor.negative}
                          onClick={() => onRemoveCart(cart)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="mobile-table">
              {carts?.data
                ?.filter((cart) => cart.product)
                .map((cart, index) => (
                  <div key={index}>
                    <div className="fit-content">
                      <div
                        className="image-container"
                        style={{
                          backgroundImage: `url('${getFileFullUrl(cart.product?.picture)}')`,
                        }}
                      ></div>
                    </div>
                    <div className="title">
                      <div>{cart.product?.name}</div>
                      <div className="deliver-price">
                        <Icon
                          size={18}
                          name={
                            !Array.isArray(cart.product?.stockProduct) &&
                            cart.product?.stockProduct?.retirementType === 'automatic'
                              ? 'ent-inmediata'
                              : 'ent-coordinada'
                          }
                        />

                        <div className="price">
                          {toUSDandCurrency(ProductFunctions.getProductPrice(cart.product))}
                        </div>

                        <Input
                          width={90}
                          type="number"
                          value={cart.count}
                          onChange={(value) => onChangeCount(Number(value), cart)}
                        />
                      </div>
                    </div>
                    <div className="total fit-content">
                      <div className="remove">
                        <IconButton
                          icon="trash"
                          color={ThemeColor['gray-80']}
                          hoverColor={ThemeColor.negative}
                          onClick={() => onRemoveCart(cart)}
                        />
                      </div>
                      <div className="total-price">
                        {toUSDandCurrency(
                          ProductFunctions.getProductPrice(cart.product) * cart.count
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="total">
              <div className="label">Subtotal</div>
              <div className="value">{toUSDandCurrency(getSubTotal())}</div>

              <div className="label">
                <div>Cuota de procesamiento</div>
                <Tooltip tooltip="En Mercado Gamer tenemos las comisiones más bajas del mercado. Debido a las comisiones de las plataformas de pago, se cobra un 4% del monto total y 25$ fijos por transacción. Es obligatorio y te asegura obtener la Garantía MG.">
                  <Icon name="exclamation-mark-circle" color={ThemeColor['gray-80']} size={18} />
                </Tooltip>
              </div>
              <div className="value">{toUSDandCurrency(getProcessingFeeTotal())}</div>

              {discount ? (
                <React.Fragment>
                  <div className="label">
                    <div>Descuento</div>
                  </div>
                  <div className="value discount">
                    -{toUSDandCurrency(discount)}
                    <div
                      className="edit-discount"
                      onClick={() => setState({ ...state, modal: { name: 'user-discount' } })}
                    >
                      <Icon name="edit" />
                    </div>
                  </div>
                </React.Fragment>
              ) : null}

              <div className="label">Total</div>
              <div className="value total">
                {toUSDandCurrency(getSubTotal() + getProcessingFeeTotal() - discount)}
              </div>
            </div>

            <div className="action">
              <div
                className="empty-cart"
                onClick={() => setState({ ...state, modal: { name: 'confirm-remove-all' } })}
              >
                <div className="icon">
                  <Icon name="trash" />
                </div>
                <div className="label">Vaciar carrito</div>
              </div>
              <Button
                kind="secondary"
                disabled={!!discount}
                onClick={() => setState({ ...state, modal: { name: 'user-discount' } })}
              >
                Usar descuento
              </Button>
              <Button onClick={gotoCheckout}>Iniciar compra</Button>
            </div>
          </div>
        ) : (
          <div className="not-cart">
            <div className="image-container"></div>
            <div className="description">
              Todavía no tenés productos en tu carrito, <br /> comienza buscando productos
            </div>
            <div className="action">
              <Button onClick={() => router.push('/catalogo')}>Buscar productos</Button>
            </div>
          </div>
        )}
      </div>
      <RelatedProductCart />

      <UserDiscountModal
        open={state.modal.name === 'user-discount'}
        totalValue={Number(toUSD(getSubTotal() + getProcessingFeeTotal(), 100))}
        onClose={() => setState({ ...state, modal: { name: '' } })}
      ></UserDiscountModal>

      <ConfirmRemoveAll
        open={state.modal.name === 'confirm-remove-all'}
        onClose={() => setState({ ...state, modal: { name: '' } })}
        onConfirm={onEmptyCart}
      ></ConfirmRemoveAll>

      <div className="shortcut-action">
        {activeShortcut === false ? (
          <Button className="action" onClick={() => setShowShortcut(true)}>
            <Icon name="help-circle" />
          </Button>
        ) : (
          <Button className="action" onClick={() => setShowShortcut(false)}>
            <Icon name="close" />
          </Button>
        )}
        {activeShortcut === true && (
          <div className="stortcut-content">
            <ShortCutMenu />
          </div>
        )}
      </div>
    </section>
  );
};
