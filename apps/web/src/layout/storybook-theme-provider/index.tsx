import styled, { css } from 'styled-components';
import { endpoints, get, setting } from '@utils';
import { useEffect } from 'react';
import { useAppDispatch } from '@store';
import { COUNTRY } from '@action-types';
import { getNotifications } from '@actions/notification';
import { ThemeColor } from '@theme/color';

const createCSS = (): any => {
  let styles = '';
  Object.keys(ThemeColor).forEach((key) => {
    styles += `--color-${key}:${ThemeColor[key]};`;
  });
  return css`
    ${styles}
  `;
};

const Container = styled.div`
  ${() => createCSS()}
`;

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  const getCountries = async (): Promise<void> => {
    try {
      const res = await get(endpoints.countriesUrl);
      const defaultCountry = res.data.data?.find(
        (item) => !!item.picture && item.name === 'Argentina'
      );
      localStorage.setItem(setting.storage.defaultCountry, JSON.stringify(defaultCountry));
      dispatch({ type: COUNTRY.SET_COUNTRY, payload: res.data.data || [] });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
    dispatch(getNotifications());
  }, []);

  return <Container className="theme-provider">{children}</Container>;
};

export default ThemeProvider;
