import { madeBackgroundImageUrl } from '@utils';

type Props = {
  title: string;
  value: number;
  image?: string;
};
export const ShoppingCard: React.FC<Props> = ({ title, value, image }) => {
  return (
    <div className="shopping-card">
      <div className="title">{title}</div>
      <div className="value">{value}</div>
      {image && <div className="image" style={{ backgroundImage: image }}></div>}
    </div>
  );
};
