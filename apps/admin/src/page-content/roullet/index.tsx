import React, { useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';
import moment from 'moment';

import { Charts } from './widgets';

import { DataTable } from '@widgets/data-table';
import { endpoints, get, getFileFullUrl, httpGetAll, madeBackgroundImageUrl } from '@utils';
import { Loading } from '@widgets/loading';

import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { useTypedSelector } from '@admin/store';
import { Card } from '../../components/card';
import { CardContainer } from '../../components/cardContainer/cardContainer';

enum countries {
  'Argentina',
  'Chile',
  'Brasil',
  'Paraguay',
  'Uruguay',
  'Bolivia',
  'Perú',
}

export enum FilterDate {
  all = 'Todas',
  today = 'Hoy',
  week = 'Esta semana',
  thisMonth = 'Este mes',
  lastMonth = 'Mes pasado',
  year = 'Este año',
  personalize = 'Personalizar',
}

type CountryType = 'all' | keyof typeof countries;

export type FilterDateType = keyof typeof FilterDate;

export const RoulletPageContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useTypedSelector((store) => store.auth);
  const [state, setState] = useState<{
    roullets: RouletteTransactionModelType[];
    total: number;
    drops: number;
    drops_many: number;
    drops_coupon: number;
    drops_referral: number;
  }>({
    roullets: [],
    total: 0,
    drops: 0,
    drops_many: 0,
    drops_coupon: 0,
    drops_referral: 0,
  });

  const [filter, setFilter] = useState<{ countries: CountryType; date: FilterDateType }>({
    countries: 'all',
    date: 'all',
  });

  const defaultCountries = useTypedSelector((store) => store.county.countries);

  useEffect(() => {
    init();
  }, [filter]);

  const init = async (): Promise<void> => {
    try {
      setLoading(true);
      const filterOption: any = {};

      if (filter.date !== 'all') {
        const today = moment();
        const lastMonth = moment().add(-1, 'month');
        switch (filter.date) {
          case 'today':
            filterOption.createdAt = { $gt: moment(today.format('YYYY-MM-DD'), 'YYYY-MM-DD') };
            break;
          case 'week':
            filterOption.createdAt = { $gt: today.add(-today.get('day'), 'day') };
            break;
          case 'thisMonth':
            filterOption.createdAt = { $gte: moment(today.format('YYYY-MM'), 'YYYY-MM') };
            break;
          case 'lastMonth':
            filterOption.createdAt = {
              $gte: moment(lastMonth.format('YYYY-MM'), 'YYYY-MM'),
              $lte: moment(today.format('YYYY-MM'), 'YYYY-MM'),
            };
            break;
          case 'year':
            filterOption.createdAt = {
              $gte: moment(lastMonth.format('YYYY'), 'YYYY'),
            };
            break;
        }
      }
      const result = await httpGetAll<RouletteTransactionModelType>(
        endpoints.rouletteTransactionUrl,
        { populate: 'userId', filter: filterOption }
      );
      let roullets = result.data.data.filter(
        (item) =>
          filter.countries === 'all' ||
          item.userId?.country ===
            defaultCountries.find((country) => country.name === filter.countries)?.id
      );

      let total = 0;
      roullets.forEach((roullet) => (total += Number(roullet.roullete)));

      const referredUsers = await httpGetAll(endpoints.userUrl, {
        filter: { referredBy: { $ne: null } },
        sort: { updatedAt: -1 },
      });

      setState({
        ...state,
        roullets,
        drops: roullets.length,
        total,
        drops_coupon: roullets.filter((roullet) => Number(roullet.roullete) === 0).length,
        drops_referral: referredUsers.data.data.length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: '',
        width: 1,
        accessor: 'userId',
        Cell: ({ row: { original } }) => (
          <div
            className="picture"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                getFileFullUrl(original?.userId?.picture),
                '/assets/imgs/avatar.webp'
              ),
            }}
          ></div>
        ),
      },
      {
        Header: 'USUARIO',
        accessor: 'userId.username',
      },
      {
        Header: 'HORA',
        width: 1,
        accessor: 'hours',
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => <div>{moment(createdAt).format('HH:mm')}</div>,
      },
      {
        Header: 'FECHA',
        width: 1,
        accessor: 'createdAt',
        Cell: ({ value }) => <div>{moment(value).format('MM/DD/YYYY')}</div>,
      },
      {
        Header: 'PREMIO',
        width: 1,
        accessor: 'roullete',
        Cell: ({ value }) => <React.Fragment>{`$${value}`}</React.Fragment>,
      },
    ],
    []
  );

  return (
    <section className="roullet-page-content">
      <Loading loading={loading} />

      <div className="header">
        <h1 className="title">Ruleta</h1>
        <div className="filter">
          <ActionMenuItem
            label="País"
            value={filter.countries}
            onChange={(value) => setFilter({ ...filter, countries: value as CountryType })}
            items={[{ label: 'Todos', value: 'all' }].concat(
              Object.keys(countries)
                .filter((key) => !isNaN(Number(countries[key])))
                .map((value) => ({ label: value, value: value }))
            )}
          ></ActionMenuItem>

          <ActionMenuItem
            label="Fecha"
            value={filter.date}
            onChange={(value) => setFilter({ ...filter, date: value as FilterDateType })}
            items={Object.keys(FilterDate).map((value) => ({
              label: FilterDate[value],
              value: value,
            }))}
          ></ActionMenuItem>
        </div>
      </div>

      <div className="content">
        <CardContainer>
          <div className="chat-container">
            <Card title="Drops totales" values={[`$${state.total}`, `${state.drops} drops`]}>
              <Charts type={filter.date} data={state.roullets} />
            </Card>
          </div>
          <div className="informations">
            <Card
              title="Drops de monedas ($)"
              picture="coins/many.webp"
              values={[`$${state.total}`]}
              description="Ver detalle"
            ></Card>

            <Card
              title="Drops de monedas (#)"
              picture="coins/many.webp"
              values={[state.drops_many]}
            ></Card>

            <Card
              title="Drops de cupones (#)"
              picture="coins/coupon.webp"
              values={[state.drops_coupon]}
            ></Card>

            <Card title="Referidos" picture="megaphone.webp" values={[state.drops_referral]}></Card>
          </div>
        </CardContainer>

        <div className="table-container">
          <div className="title">Drops por usuario</div>
          <DataTable columns={columns} data={state.roullets}></DataTable>
        </div>
      </div>
    </section>
  );
};
