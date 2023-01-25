import { Input } from '@widgets/input';
import { Controller } from 'react-hook-form';

export const FormInput: React.FC<FormControllerType & InputProps & WrapLabelProps> = (props) => {
  const { control, rules, name, helper, ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Input
          value={value}
          error={!!error?.message}
          helper={error?.message || helper}
          inputRef={ref}
          {...rest}
          onChange={(value) => {
            onChange(value);
            props.onChange && props.onChange(value);
          }}
        />
      )}
    />
  );
};
