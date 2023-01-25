import styled, { css } from 'styled-components';
import { ThemeColor } from '@theme/color';
import { endpoints, get, setting } from '@utils';
import { useEffect } from 'react';
import { useAppDispatch } from '@store';
import { COUNTRY } from '@action-types';

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

export const StorybookThemeProvider: React.FC<Props> = ({ children }) => {
  return <Container className="theme-provider">{children}</Container>;
};

export default StorybookThemeProvider;
