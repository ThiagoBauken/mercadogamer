export const SwitcherOption: React.FC<any> = ({ text, selected, onClick }) => {
  const getClass = () => {
    return 'component-switcher-option' + (selected ? ' component-switcher-option-selected' : '');
  };

  return (
    <div onClick={onClick} className={getClass()}>
      <span>{text}</span>
    </div>
  );
};
