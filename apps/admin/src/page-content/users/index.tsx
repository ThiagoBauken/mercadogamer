import React, { useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';
import moment from 'moment';

import { DataTable } from '@widgets/data-table';
import { endpoints, get, getFileFullUrl, httpGetAll, madeBackgroundImageUrl } from '@utils';
import { Loading } from '@widgets/loading';

import { ActionMenuItem } from '@ui-shared/components/action-menu-item';
import { useTypedSelector } from '@admin/store';
import { Card } from '../../components/card';
import { CardContainer } from '../../components/cardContainer/cardContainer';
import { Button } from '@widgets/button';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';
import { Search } from '@widgets/search';
import { ThemeColor } from '@theme/color';
import { useRouter } from 'next/router';

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

export const UsersPageContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const [state, setState] = useState<{
    users: UserModelType[];
    total_buy: number;
    total_sell: number;
  }>({
    users: [],
    total_buy: 0,
    total_sell: 0,
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
      const result = await httpGetAll<UserModelType>(endpoints.userUrl, {
        filter: filterOption,
      });

      let users = result.data.data;

      setState({
        ...state,
        users,
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
        accessor: 'picture',
        Cell: ({ row: { original } }) => (
          <div
            className="picture"
            style={{
              backgroundImage: madeBackgroundImageUrl(
                getFileFullUrl(original?.picture),
                '/assets/imgs/avatar.webp'
              ),
            }}
          ></div>
        ),
      },
      {
        Header: 'USUARIO',
        width: 1,
        accessor: 'username',
        Cell: ({ row: { original } }) => <div className="name">{original?.username}</div>,
      },
      {
        Header: 'E-MAIL',
        width: 1,
        accessor: 'emailAddress',
        Cell: ({ row: { original } }) => (
          <div className="emailAddress">{original?.emailAddress}</div>
        ),
      },
      {
        Header: 'COMPRAS',
        width: 1,
        accessor: 'buy',
        Cell: ({ row: { original } }) => (
          <div className="buy">
            {original?.userTotalQualifications === 0
              ? '-'
              : original?.userTotalQualifications === 0}
          </div>
        ),
      },
      {
        Header: 'VENTAS',
        width: 1,
        accessor: 'sell',
        Cell: ({ row: { original } }) => (
          <div className="sell">
            {original?.sellerTotalQualifications !== 0 ? original?.sellerTotalQualifications : '-'}
          </div>
        ),
      },
      {
        accessor: 'action',
        width: 1,
        Cell: ({ row: { original } }) => (
          <div className="action-menu">
            <Menu
              activator={<Icon name="more-vertical" size={24} color={ThemeColor['gray-80']} />}
              menuItems={[
                {
                  label: 'Editar',
                  action: () => '',
                },
                { label: 'Banear', action: () => '' },
                { label: 'Banear en ruleta', action: () => '' },
                {
                  label: 'Eliminar',
                  color: ThemeColor.negative,
                  action: () => '',
                },
              ]}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <section className="user-page-content">
      <Loading loading={loading} />

      <div className="header">
        <h1 className="title">Usuarios</h1>
        <div className="action">
          <Menu
            activator={
              <div className="download-type-menu">
                <Icon name="more-vertical" />
              </div>
            }
            menuItems={[{ label: 'Descargar lista' }]}
          ></Menu>
        </div>
      </div>

      <div className="filter-config">
        <div className="search">
          <Search bgColor="transparent" width={300} placeholder="Buscar" />
        </div>
        <div className="filter">
          <ActionMenuItem
            label="Estado"
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
        <div className="table-container">
          <DataTable columns={columns} data={state.users}></DataTable>
        </div>
      </div>
    </section>
  );
};
