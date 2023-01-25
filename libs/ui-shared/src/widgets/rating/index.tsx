import { useMemo } from 'react';
import styled from 'styled-components';
import { ThemeColor } from '@theme/color';
import { Icon } from '@widgets/icon';

const Container = styled.div`
  --mercado-rating-active-color: ${({ activeColor }) => activeColor};
  --mercado-rating-deactive-color: ${({ deactiveColor }) => deactiveColor};
  --mercado-rating-icon-size: ${({ iconSize }) => iconSize};
`;

export const Rating: React.FC<RatingProps> = (props) => {
  const {
    className,
    icon = 'star-outline',
    activeIcon = 'star-outline',
    iconSize = 16,
    maxRating = 5,
    rating = 0,
    editable = false,
    activeColor = ThemeColor.primary,
    deactiveColor = ThemeColor['gray-100'],
  } = props;

  const classNames = useMemo<string>(() => {
    const classes = ['mercado-rating'];
    className && classes.push(className);
    editable && classes.push('editable');
    return classes.join(' ');
  }, [className, editable]);

  const onChange = (rate: number): void => {
    editable && props.onChange && props.onChange(rate);
  };

  return (
    <Container
      className={classNames}
      activeColor={activeColor}
      deactiveColor={deactiveColor}
      iconSize={typeof iconSize === 'string' ? iconSize : `${iconSize}px`}
    >
      {Array.from(Array(maxRating).keys()).map((index) => (
        <div
          className={`item${index <= rating-1 && rating ? ' active' : ''}`}
          key={index}
          onClick={() => onChange(index + 1)}
        >
          <Icon name={index < rating && rating ? activeIcon : icon} />
        </div>
      ))}
    </Container>
  );
};
