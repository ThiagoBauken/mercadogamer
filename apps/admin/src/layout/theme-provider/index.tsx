import styled, { css } from 'styled-components';
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

export const StorybookThemeProvider: React.FC<ChildrenProps> = ({ children }) => {
  return <Container className="theme-provider">{children}</Container>;
};

export default StorybookThemeProvider;
