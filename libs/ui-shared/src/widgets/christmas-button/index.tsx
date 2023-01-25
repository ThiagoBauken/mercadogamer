import { useMemo } from 'react';
import styled from 'styled-components';
import { ThemeColor } from '@theme/color';
import { Loading } from '@widgets/loading';
import { Icon } from '@widgets/icon';
import { ButtonProps } from '../../types/button';
import Image from 'next/image';
import { getFileFullUrl } from '@utils';

const Container = styled.button`
  --mercado-button-bg-color: ${({ bgColor }) => bgColor};
  --mercado-button-bg-color--hover: ${({ bgColor }) => `${bgColor}66`};
  --mercado-button-bg-color--10: ${({ bgColor }) => `${bgColor}1A`};
  --mercado-button-bg-color--20: ${({ bgColor }) => `${bgColor}33`};
  --mercado-button-radius: ${({ radius }) => radius}px;
  --mercado-button-color: ${({ textColor }) => textColor};
  width: ${({ width }) => width};
`;

export const EventButton: React.FC<ButtonProps> = ({
  kind = 'primary',
  type = 'button',
  bgColor = ThemeColor.negative,
  color = ThemeColor['gray-130'],
  radius = 50,
  size = 'normal',
  disabled = false,
  width = 'fit-content',
  full = false,
  loading = false,
  roundIcon,
  textTransform = 'unset',
  ...props
}) => {
  const classNames = useMemo(() => {
    const classes = ['mercado-button'];
    size && classes.push(size);
    kind && classes.push(kind);
    disabled && classes.push('disabled');
    loading && classes.push('loading');
    textTransform && textTransform !== 'unset' && classes.push(textTransform);
    return classes.join(' ');
  }, [size, kind, disabled, loading, textTransform]);

  return (
    <Container
      type={type}
      className={classNames}
      textColor={color}
      bgColor={bgColor}
      radius={radius}
      disabled={disabled}
      width={full ? '100%' : typeof width === 'string' ? width : `${width}px`}
      onClick={() => !loading && !disabled && props.onClick && props.onClick()}
    >
      <div className="event-background">
        <Image
          src={'../assets/imgs/christmas-services/wave.webp'}
          layout="fixed"
          loading="lazy"
          unoptimized={true}
          width={53.06}
          height={10.22}
          alt="homepage banner"
        />
      </div>
      <div className="ch-background"></div>
      {loading && <Loading loading position="absolute" size={20} color={ThemeColor.negative} />}

      <div className="ch-content">
        {kind === 'round' && roundIcon ? <Icon name={roundIcon} /> : props.children}
      </div>
    </Container>
  );
};
