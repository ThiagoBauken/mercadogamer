import { useEffect, useState } from 'react';
import { useTypedSelector, addCart } from '@store';
import {
  endpoints,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  ProductFunctions,
  toUSDandCurrency,
  addMessageToToast,
} from '@utils';
import { QuestionContent, ProductContent } from './widgets';
import moment from 'moment';
import { useRouter } from 'next/router';
import { BreakPoints } from '@theme/breakpoints';
import { useWindowSize } from '@hooks';
import { Search } from '@widgets/search';
import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { Icon } from '@widgets/icon';

type FilterDate = 'all' | 'this-month' | 'last-month' | 'this-year';

export const QuestionPageContent: React.FC = () => {
  const router = useRouter();
  const { user } = useTypedSelector((store) => store.auth);
  const { width } = useWindowSize();
  const [state, setState] = useState<{
    qas: { [key: string]: { list: ProductQAModelType[]; collapse: boolean } };
    date: FilterDate;
  }>({ qas: {}, date: 'all' });

  useEffect(() => {
    user?.id && loadProducts();
  }, [user?.id, state.date]);

  const loadProducts = async (): Promise<void> => {
    try {
      const today = moment();
      const lastMonth = moment().add(-1, 'month');
      const filter: any = { seller: user.id };

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
        populate: ['seller', 'product'],
        filter,
        sort: { updatedAt: -1 },
      });
      const qas: { [key: string]: { list: ProductQAModelType[]; collapse: boolean } } = {};
      Array.isArray(response.data?.data) &&
        response.data.data.forEach((item) => {
          if (item.product?.id) {
            if (!qas[item.product.id])
              qas[item.product.id] = { list: [], collapse: state.qas[item.product.id]?.collapse };
            qas[item.product.id].list.push(item);
          }
        });

      setState({ ...state, qas });
    } catch (error) {
      console.log(error);
    }
  };

  const onCollapse = (key: string): void => {
    const { qas } = state;
    qas[key].collapse = !qas[key].collapse;
    setState({ ...state, qas });
  };

  return (
    <section className="question-page-content">
      <div className="title">
        <div className="subject">Consultas</div>
        <div className="description">Preguntas realizadas por usuarios en tus publicaciones</div>
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
        <ul className="question-by-product">
          {Object.keys(state.qas).map((key) => {
            const product = state.qas[key].list?.[0]?.product;
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
                    <div className="product">
                      <div className="product-status">
                        <div className="stock">
                          {product?.stock ? 'Stock disponible' : 'Sin stock'}
                        </div>
                        <div className="price">
                          {toUSDandCurrency(ProductFunctions.getProductPrice(product))}
                        </div>
                      </div>
                      <div className="detail">
                        <div className="views">{`${
                          state.qas[key]?.list?.filter((item) => !item.answer)?.length
                        } PENDIENTES`}</div>
                        <div className="expand action" onClick={() => onCollapse(key)}>
                          <Icon name="chevron-down" />
                        </div>
                      </div>
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
                    <div className="mobile-dropdown">
                      <div className="expand action" onClick={() => onCollapse(key)}>
                        <Icon name="chevron-down" />
                      </div>
                      <div className="views">
                        {state.qas[key]?.list?.filter((item) => !item.answer)?.length ? (
                          <div className="unread"></div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                    <div></div>
                    <div className="stock">{product?.stock ? 'Sin stock' : 'Stock disponible'}</div>
                    <div className="price">
                      {toUSDandCurrency(ProductFunctions.getProductPrice(product))}
                    </div>
                  </div>
                )}

                {state.qas[key].collapse && (
                  <ul className="qas-list">
                    {state.qas[key].list.map((item: ProductQAModelType) => (
                      <li key={item.id}>
                        <QuestionContent question={item} onAction={loadProducts} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
