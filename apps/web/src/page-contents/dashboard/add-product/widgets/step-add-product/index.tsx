import { useMemo } from 'react';

type Props = {
  step: number;
  maxStep: number;
  onClickStep: (step: number) => void;
};
export const StepAddProduct: React.FC<Props> = ({ step, maxStep, onClickStep }) => {
  const steps = useMemo<{ label: string }[]>(
    () => [
      { label: 'Tipo de publicación' },
      { label: 'Tipo de producto' },
      { label: 'Juego' },
      { label: 'Detalles' },
      { label: 'Entrega' },
      { label: 'Precio' },
    ],
    []
  );

  const classNames = useMemo<string>(() => {
    const classes = ['step-add-product'];
    step === 1 && classes.push('first');
    step === 6 && classes.push('last');
    return classes.join(' ');
  }, [step]);

  const cardClassName = (index: number): string => {
    const result = [];
    const current = index + 1;
    current < maxStep && result.push('passed');
    current === step && result.push('active');
    current > maxStep && result.push('disabled');
    current === step - 1 && result.push('before');
    current === step + 1 && result.push('after');
    return result.join(' ');
  };

  return (
    <ul className={classNames}>
      {steps.map((item, index) => (
        <li
          key={index}
          className={cardClassName(index)}
          onClick={() => index + 1 <= maxStep && onClickStep(index + 1)}
        >
          <div className="step">{index + 1}</div>
          <div className="label">{item.label}</div>
        </li>
      ))}
    </ul>
  );
};
