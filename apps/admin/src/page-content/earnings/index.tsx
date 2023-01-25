import React, { useEffect, useState } from 'react';
import { get, toCurrency } from '../../../../../libs/ui-shared/src/utils';
import { orderUrl } from '../../../../../libs/ui-shared/src/utils/endpoints';
import { Loading } from '../../../../../libs/ui-shared/src/widgets/loading';
import { Card } from '../../components/card';
import { CardContainer } from '../../components/cardContainer/cardContainer';
import { ThemeColor } from '../../../../../libs/ui-shared/src/theme/color';
import { CardKPI } from '../../components/cardKPI/cardKPI';
import { ActionMenuItem } from '../../../../../libs/ui-shared/src/components/action-menu-item';
import { Chart } from '../../../../../libs/ui-shared/src/components/chart';
import moment from 'moment';
import ReactDOMServer from 'react-dom/server';
import {
  dateOptions,
  getDateParam,
} from '../../../../../libs/ui-shared/src/utils/common/date-filter';

export const EarningsPageContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderAdminDashboardType>(undefined);
  const [date, setDate] = useState('30-days');

  useEffect(() => {
    init();
  }, [date]);

  const init = async () => {
    const dateParam = getDateParam(date);
    const { data } = await get<OrderAdminDashboardType>(orderUrl + '/adminDashboard', {
      date: dateParam,
    });
    data.perDayInfo = data.perDayInfo
      .map((obj) => ({
        ...obj,
        date: moment(obj.date),
      }))
      .sort((a, b) => a.date.diff(b.date))
      .map((obj) => ({
        ...obj,
        date: obj.date.format('DD-MM-YYYY'),
      }));

    setOrderData(data);
    setLoading(false);
  };

  const Content = () => (
    <>
      <div className="earnings-header">
        <ActionMenuItem
          label="Fecha"
          value={date}
          onChange={(value) => setDate(value)}
          items={dateOptions}
        ></ActionMenuItem>
      </div>
      <div className="content">
        <CardContainer>
          <Card
            title="Ganancia"
            values={[
              toCurrency(
                (orderData.sellerComissionTotal + orderData.processingFeeTotal).toFixed(2)
              ),
            ]}
          >
            <Chart
              style={{
                width: '100%',
                height: '350px',
              }}
              option={{
                xAxis: {
                  type: 'category',
                  data: orderData.perDayInfo.map((o) => o.date),
                },
                yAxis: {
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      color: ThemeColor['gray-100'],
                    },
                  },
                },
                tooltip: {
                  trigger: 'axis',
                  formatter: (params) => {
                    const actualValue = params[0].value.toFixed(2);
                    const key = params[0].axisValue;
                    const { perDayInfo } = orderData;
                    let accum = 0;

                    for (let i = 0; i < perDayInfo.length; i++) {
                      accum +=
                        perDayInfo[i].processingFeeTotal + perDayInfo[i].sellerComissionTotal;

                      if (perDayInfo[i].date === key) {
                        break;
                      }
                    }

                    const element = (
                      <div>
                        <h3>{key}</h3>
                        <p>
                          <strong>En el dia:</strong> {actualValue}
                        </p>
                        <p>
                          <strong>Acumulado:</strong> {accum.toFixed(2)}
                        </p>
                      </div>
                    );

                    return ReactDOMServer.renderToStaticMarkup(element);
                  },
                },
                series: [
                  {
                    data: orderData.perDayInfo.map(
                      (o) => o.sellerComissionTotal + o.processingFeeTotal
                    ),
                    type: 'line',
                    smooth: true,
                    color: ThemeColor.primary,
                  },
                ],
              }}
            />
          </Card>
          <Card title="Facturación">
            <div className="facturacion-card-container">
              <div className="facturacion-card-text">
                <CardKPI
                  text={toCurrency(
                    (
                      orderData.balanceUsedTotal +
                      orderData.giftUsedTotal +
                      orderData.pricePaidTotal
                    ).toFixed(2)
                  )}
                  description="Facturación total"
                />
                <ul>
                  <li>
                    <div className="bullet"></div>Balance de ventas
                    <span>{toCurrency(orderData.balanceUsedTotal.toFixed(2))}</span>
                  </li>
                  <li>
                    <div className="bullet"></div>Dinero abonado
                    <span>{toCurrency(orderData.pricePaidTotal.toFixed(2))}</span>
                  </li>
                  <li>
                    <div className="bullet"></div>Balance de regalo
                    <span>{toCurrency(orderData.giftUsedTotal.toFixed(2))}</span>
                  </li>
                </ul>
              </div>
              <Chart
                option={{
                  tooltip: {
                    trigger: 'item',
                  },
                  legend: {
                    show: false,
                  },
                  series: [
                    {
                      type: 'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      label: {
                        show: false,
                        position: 'center',
                      },
                      labelLine: {
                        show: false,
                      },
                      data: [
                        {
                          name: 'Balance de ventas',
                          value: orderData.balanceUsedTotal,
                          itemStyle: { color: '#1774FF' },
                        },
                        {
                          name: 'Dinero abonado',
                          value: orderData.pricePaidTotal,
                          itemStyle: { color: '#3BD42B' },
                        },
                        {
                          name: 'Balance de regalo',
                          value: orderData.giftUsedTotal,
                          itemStyle: { color: '#712FFF' },
                        },
                      ],
                    },
                  ],
                }}
              />
            </div>
          </Card>
          <Card title="Comisión">
            <div className="comision-card-container">
              <CardKPI
                text={toCurrency(orderData.processingFeeTotal.toFixed(2))}
                description="Compradores"
              />
              <hr />
              <CardKPI
                text={toCurrency(orderData.sellerComissionTotal.toFixed(2))}
                description="Vendedores"
              />
            </div>
          </Card>
          <Card
            title="Ganancia de vendedores"
            values={[toCurrency(orderData.sellerProfitTotal.toFixed(2))]}
          />
        </CardContainer>
      </div>
    </>
  );

  return (
    <div className="earnings-page-content">
      <h1 className="title">Ganancias</h1>
      {loading && <Loading />}
      {orderData && (
        <>
          <Content />
        </>
      )}
    </div>
  );
};
