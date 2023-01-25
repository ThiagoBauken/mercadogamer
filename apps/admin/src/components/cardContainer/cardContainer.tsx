type IProps = {
  gridColumns?: number;
} & ChildrenProps;

export const CardContainer: React.FC<IProps> = ({ gridColumns = 2, children }) => {
  const getStyle = () => {
    return {
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    };
  };

  return (
    <div className="card-container" style={getStyle()}>
      {children}
    </div>
  );
};
