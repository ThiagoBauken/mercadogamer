type Props = {
  id?: string;
  label: string;
  onClick?: () => void;
};

const CategoryCard: React.FC<Props> = (props) => {
  const { label, onClick } = props;
  return (
    <div className="category-card" onClick={onClick}>
      {label}
    </div>
  );
};

export default CategoryCard;
