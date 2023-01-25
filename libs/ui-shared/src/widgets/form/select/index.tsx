import { Select } from '@widgets/select';
import { Controller } from 'react-hook-form';

export const FormSelect: React.FC<FormControllerType & SelectProps & WrapLabelProps> = (props) => {
  const { control, rules, name, helper, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Select
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
