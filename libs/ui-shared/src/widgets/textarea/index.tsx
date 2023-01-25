import { WrapLabel } from '@widgets/wrap-label';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  grid-template-columns: ${({ template }) => template};
  --mercado-input-bg-color: ${({ bgColor }) => bgColor};
  min-width: ${({ width }) => (width === 'fit-content' ? '370px' : 'unset')};
`;

export const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    className,
    rows = 5,
    value,
    label,
    helper,
    error,
    disabled,
    placeholder,
    bgColor = 'transparent',
    inputRef,
    width = 'fit-content',
    full = false,
  } = props;

  const [focus, setFocus] = useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    props.onChange && props.onChange(event.target.value);
  };

  const classNames = useMemo(() => {
    const classes = ['mercado-textarea'];
    error && classes.push('error');
    focus && classes.push('focus');
    disabled && classes.push('disabled');
    return classes.join(' ');
  }, [error, focus, disabled]);

  return (
    <WrapLabel
      className={className}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      width={full ? '100%' : width}
    >
      <Container className={classNames} bgColor={bgColor} width={full ? '100%' : width}>
        <textarea
          ref={inputRef}
          rows={rows}
          value={typeof value === 'number' ? value : value || ''}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          disabled={disabled}
          placeholder={placeholder}
        />
      </Container>
    </WrapLabel>
  );
};
