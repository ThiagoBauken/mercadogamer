import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTypedSelector, addCart, useAppDispatch, openLoginModal } from '@store';
import {
  endpoints,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  ProductFunctions,
  toUSDandCurrency,
  addMessageToToast,
} from '@utils';
import { QasContent } from './widgets';
import moment from 'moment';
import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { ThemeColor } from '@theme/color';
import { Search } from '@widgets/search';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { Button } from '@widgets/button';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';

type FilterDate = 'all' | 'this-month' | 'last-month' | 'this-year';

export const QAsPageContent: React.FC = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((store) => store.auth);
  const { width } = useWindowSize();
  const [state, setState] = useState<{
    qas: { [key: string]: ProductQAModelType[] }[];
    date: FilterDate;
    showFilterInMobile: boolean;
  }>({ qas: [], date: 'all', showFilterInMobile: false });

  useEffect(() => {
    user?.id && loadQas();
  }, [user?.id, state.date]);

  const loadQas = async (): Promise<void> => {
    try {
      const today = moment();
      const lastMonth = moment().add(-1, 'month');
      const filter: any = { buyer: user.id };
      switch (state.date) {
        case 'this-month':
          filter.createdAt = { $gte: moment(today.format('YYYY-MM'), 'YYYY-MM') };
          break;
        case 'last-month':
          filter.createdAt = {
            $gte: moment(lastMonth.format('YYYY-MM'), 'YYYY-MM'),
            $lte: moment(today.format('YYYY-MM'), 'YYYY-MM'),
          };
          break;
        case 'this-year':
          filter.createdAt = {
            $gte: moment(lastMonth.format('YYYY'), 'YYYY'),
          };
          break;
      }
      const response = await httpGetAll<ProductQAModelType>(endpoints.productQAsUrl, {
        populate: ['buyer', 'product'],
        filter,
        sort: { updatedAt: -1 },
      });
      const qas: { [key: string]: ProductQAModelType[] }[] = [];
      Array.isArray(response.data?.data) &&
        response.data.data.forEach((item) => {
          if (item.product?.id) {
            if (!qas[item.product.id]) qas[item.product.id] = [];
            qas[item.product.id].push(item);
          }
        });
      setState({ ...state, qas });
    } catch (error) {
      console.log(error);
    }
  };

  const onAddCart = async (id: any): Promise<void> => {
    if (!user?.id) {
      dispatch(openLoginModal());
      // router.push(`/login?redirect=${router.asPath}`);
    } else {
      try {
        await addCart(id);
      } catch (error) {
        addMessageToToast(error.response.data.message, {
          icon: 'alert-triangle',
          status: 'error',
          actionName: 'VER CARRITO',
          onAction: () => router.push('/cart'),
        });
      }
    }
  };
  return (
    <section className="qas-page-content">
      <div className="title">
        <div className="subject">Mis preguntas</div>
        <div className="description">Preguntas que realizaste en productos de otros usuarios</div>
      </div>
      <div className="main-content">
        <div className="filter">
          <Search bgColor="transparent" placeholder="Buscar" />
          <ActionMenuItem
            label="Fecha"
            items={[
              { label: 'Todas', value: 'all' },
              { label: 'Este mes', value: 'this-month' },
              { label: 'Mes pasado', value: 'last-month' },
              { label: 'Este año', value: 'this-year' },
            ]}
            value={state.date}
            onChange={(value) => setState({ ...state, date: value as FilterDate })}
          />
        </div>

        <ul className="qas-by-product">
          {Object.keys(state.qas).map((key) => {
            const product = state.qas[key]?.[0]?.product;
            return (
              <li key={key}>
                {width > BreakPoints.lg ? (
                  <div className="header">
                    <div className="product-img">
                      <div
                        className="image-container"
                        style={{
                          backgroundImage: madeBackgroundImageUrl(getFileFullUrl(product.picture)),
                        }}
                      ></div>
                      <div className="name">{product?.name}</div>
                    </div>
                    <div className="stock">
                      {product?.stock > 0 ? `Stock disponible` : 'Sin stock'}
                    </div>
                    {/* {product?.enabled ? (
                      <div className="stock">{product?.stock > 0 ? `Stock disponible` : 'Sin stock'}</div>
                    ) : (
                      <div className="stock"></div>
                    )} */}
                    <div className="price">
                      {toUSDandCurrency(ProductFunctions.getProductPrice(product))}
                    </div>
                    <div className="add-cart">
                      {product?.stock ? (
                        <Button kind="secondary" onClick={() => onAddCart(product.id)}>
                          Agregar al carrito
                        </Button>
                      ) : (
                        <Button kind="secondary" disabled>
                          Agregar al carrito
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="header">
                    <div
                      className="image-container"
                      style={{
                        backgroundImage: madeBackgroundImageUrl(getFileFullUrl(product.picture)),
                      }}
                    ></div>
                    <div className="name">{product?.name}</div>
                    <div className="action">
                      <Menu
                        activator={
                          <Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />
                        }
                        menuItems={[
                          {
                            label: 'Agregar al carrito',
                            action: () => onAddCart(product.id),
                          },
                        ]}
                      />
                    </div>
                    <div></div>
                    <div className="detail">
                      <div className="stock">
                        {product?.stock ? `Stock disponible` : 'Sin stock'}
                      </div>
                      <div className="price">
                        {toUSDandCurrency(ProductFunctions.getProductPrice(product))}
                      </div>
                    </div>
                  </div>
                )}

                <ul className="qas-list">
                  {state.qas[key].map((item: ProductQAModelType) => (
                    <li key={item.id}>
                      <QasContent qas={item} onDelete={loadQas} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
