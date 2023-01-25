import React, { useEffect } from 'react';
import moment from 'moment';
import { getRouletteTransaction, useAppDispatch, useTypedSelector } from '@store';
import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { RouletteKind } from '../../constanst';

export const RouletteHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    auth: { user },
    roulette,
  } = useTypedSelector((store) => store);

  useEffect(() => {
    dispatch(getRouletteTransaction());
  }, []);

  const renderValue = (value: string | number): React.ReactNode => (
    <div
      className="value-item"
      style={{ color: RouletteKind.find((item) => item.value == +value)?.color }}
    >
      <div
        className="image-container"
        style={{
          backgroundImage: madeBackgroundImageUrl(
            RouletteKind.find((item) => item.value == +value)?.image
          ),
        }}
      ></div>
      <div className="value">{RouletteKind.find((item) => item.value == +value)?.label}</div>
    </div>
  );

  return (
    <div className="roulette-history">
      <div className="my-history table-container">
        <div className="title">Tu historial</div>
        <div className="content">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Premio</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(roulette.history?.data) &&
                user?.id &&
                roulette.history.data
                  .filter((history) => history.userId?.id === user.id)
                  .map((history, index) => (
                    <tr key={index}>
                      <td>{moment(history.createdAt).format('MM/DD/YYYY')}</td>
                      <td>{moment(history.createdAt).format('HH:mm')}</td>
                      <td>{renderValue(history.roullete)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="user-history table-container">
        <div className="title">Drops en vivo</div>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Premio</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(roulette.history?.data) &&
              roulette.history.data.map((history, index) => (
                <tr key={index}>
                  <td>
                    <div className="user-info">
                      <div
                        className="avatar"
                        style={{
                          backgroundImage: madeBackgroundImageUrl(
                            getFileFullUrl(history.userId?.picture),
                            '/assets/imgs/avatar.webp'
                          ),
                        }}
                      ></div>
                      <div className="name">{history.userId?.username}</div>
                    </div>
                  </td>
                  <td>{renderValue(history.roullete)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
