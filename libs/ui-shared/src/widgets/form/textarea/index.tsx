import { Textarea } from '@widgets/textarea';
import { Controller } from 'react-hook-form';

export const FormTextarea: React.FC<FormControllerType & TextareaProps & WrapLabelProps> = (
  props
) => {
  const { control, rules, name, helper, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Textarea
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
