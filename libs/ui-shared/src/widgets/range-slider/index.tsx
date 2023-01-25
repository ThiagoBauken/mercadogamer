import { ThemeColor } from '@theme/color';
import { Range, getTrackBackground } from 'react-range';
export const RangeSlider: React.FC<RangeSliderProps> = (props) => {
  const { step = 1, min = 0, max = 100, value = [0], disabled, color = ThemeColor.primary } = props;

  const onChange = (value: number[]): void => {
    props.onChange && props.onChange(value);
  };

  const onFinalChange = (value: number[]) => {
    props.onFinalChange && props.onFinalChange(value);
  }


  return (
    <div className="mercado-range-slider">
      <Range
        values={value}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onChange={onChange}
        onFinalChange={onFinalChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: value,
                  colors:
                    value.length === 1
                      ? [color, ThemeColor['gray-100']]
                      : [
                          ThemeColor['gray-100'],
                          disabled ? ThemeColor['gray-70'] : color,
                          ThemeColor['gray-100'],
                        ],
                  min: min,
                  max: max,
                  rtl: false,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '14px',
              width: '14px',
              borderRadius: '50%',
              backgroundColor: disabled ? ThemeColor['gray-80'] : 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          ></div>
        )}
      />
    </div>
  );
};
