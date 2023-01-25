import { useEffect, useState } from 'react';
import { ThemeColor } from '@theme/color';
import { Input } from '@widgets/input';

interface Props extends InputProps {
  delayTime?: number;
}

export const Search: React.FC<Props> = (props) => {
  const {
    label,
    delayTime = 300,
    value,
    helper,
    error,
    disabled,
    placeholder,
    bgColor,
    ...inputProps
  } = props;

  const [_value, setValue] = useState<string | number>('');

  useEffect(() => {
    setValue(value);
  }, [value]);

  const onChange = (val: string | number): void => {
    setValue(val);
    props.onChange && props.onChange(val);
  };
  return (
    <Input
      {...inputProps}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      prefix="search"
      value={_value}
      bgColor={bgColor || ThemeColor['gray-100']}
      onChange={onChange}
      full
    />
  );
};
