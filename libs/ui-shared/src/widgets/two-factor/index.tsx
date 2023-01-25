import React, { useState, useEffect, useRef } from 'react';

type Props = {
  value?: string | string[];
  error?: boolean;
  onChange?: (value: string[]) => void;
};

export const TwoFactor: React.FC<Props> = (props) => {
  const { value = '', error } = props;

  // state
  const [state, setState] = useState<{
    value: string[];
  }>({
    value: ['', '', '', '', '', ''],
  });

  // effect
  const refs = useRef(Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>()));

  useEffect(() => {
    const values = typeof value === 'string' ? value.split('') : [...value];
    const temp = values.slice(0, 6);
    if (temp.length < 6) {
      for (let i = 0; i < 6 - values.length; i++) temp.push('');
    }
    setState({
      ...state,
      value: temp,
    });
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    state.value.splice(index, 1, event.target.value);
    setState({
      ...state,
      value: [...state.value],
    });
    if (index < 5) refs.current[index + 1].current.focus();
    props.onChange && props.onChange(state.value);
  };

  const renderInput = (index: number): React.ReactNode => (
    <input
      maxLength={1}
      required
      onChange={(event) => onChange(event, index)}
      ref={refs.current[index]}
    ></input>
  );
  return (
    <div className={`mercado-two-factor${error ? ' error' : ''}`}>
      {renderInput(0)}
      {renderInput(1)}
      {renderInput(2)}
      {renderInput(3)}
      {renderInput(4)}
      {renderInput(5)}
    </div>
  );
};

export default TwoFactor;
