import React, { useEffect, useState, useRef, MouseEvent } from 'react';
import styled from 'styled-components';

import { ThemeColor } from '@theme/color';

const Container = styled.div.attrs((props) => ({
  style: {
    background: props.background,
    top: props.styles.top ? `${props.styles.top}px` : 'unset',
    bottom: props.styles.bottom ? `${props.styles.bottom}px` : 'unset',
    left: props.styles.left ? `${props.styles.left}px` : 'unset',
    right: props.styles.top ? `${props.styles.right}px` : 'unset',
  },
}))`
  --mercado-tooltip-background-color: ${(props) => props.bgColor};
  --mercado-tooltip-color: ${(props) => props.borderColor};
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
`;

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    tooltip,
    position = 'top',
    bgColor = ThemeColor['gray-100'],
    borderColor = ThemeColor['gray-100'],
    move,
    show,
    width = 'auto',
  } = props;
  const [tooltipPosition, setTooltipPosition] = useState<MenuPositionType>({});
  const [selfShow, setSelfShow] = useState<boolean>(false);

  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getMenuPosition = (): void => {
    if (tooltip) {
      setSelfShow(true);

      const tooltipRect = tooltipRef.current?.getBoundingClientRect();

      if (targetRef.current && tooltipRect) {
        const { top, left, right, bottom } = targetRef.current?.getBoundingClientRect();
        const { width, height } = tooltipRect;
        const tooltip_position: MenuPositionType = {};
        if (position === 'bottom') {
          tooltip_position.top = bottom + 10;
          tooltip_position.left = left - (width - (right - left)) / 2;
        } else if (position === 'top') {
          tooltip_position.bottom = window.innerHeight - top + 10;
          tooltip_position.left = left - (width - (right - left)) / 2;
        } else if (position === 'left') {
          tooltip_position.top = top - (height - (bottom - top)) / 2;
          tooltip_position.right = window.innerWidth - left + 15;
        } else if (position === 'right') {
          tooltip_position.top = top - (height - (bottom - top)) / 2;
          tooltip_position.left = left + (right - left) + 15;
        }
        !move && setTooltipPosition(tooltip_position);
      }
    }
  };

  useEffect(() => {
    getMenuPosition();
    window.addEventListener('scroll', getMenuPosition);
    window.addEventListener('resize', getMenuPosition);
    return () => {
      window.removeEventListener('scroll', getMenuPosition);
      window.removeEventListener('resize', getMenuPosition);
    };
  }, []);

  useEffect(() => {
    props.onChangeShow && props.onChangeShow(selfShow);
  }, [selfShow]);

  const onMouseMove = (event: MouseEvent): void => {
    if (move) {
      setTooltipPosition({
        top: event.pageY,
        left: event.pageX,
      });
    } else {
      getMenuPosition();
    }
  };
  return (
    <div
      className={`mercado-tooltip-container${show ? ' show' : ''}`}
      onMouseEnter={() => setSelfShow(true)}
      onMouseLeave={() => setSelfShow(false)}
    >
      <div
        className="content"
        ref={targetRef}
        onMouseMove={onMouseMove}
        onMouseOver={getMenuPosition}
      >
        {props.children}
      </div>
      {tooltip && (
        <Container
          className={`mercado-tooltip ${move ? 'move' : position}`}
          ref={tooltipRef}
          styles={tooltipPosition}
          borderColor={borderColor}
          bgColor={bgColor}
          width={width}
        >
          {tooltip}
        </Container>
      )}
    </div>
  );
};

export default Tooltip;
