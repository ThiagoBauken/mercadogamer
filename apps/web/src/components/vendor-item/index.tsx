import Image from 'next/image';

type Props = {
  item: string;
  title?: string;
  content?: string;
  width?: number;
  height?: number;
};

const ItemCard: React.FC<Props> = (props) => {
  const { item, title, content, height, width } = props;
  console.log(width, height);
  return (
    <div className="vendor-item">
      <div className="image">
        <Image
          src={item}
          className="icon"
          width={width}
          height={height}
          loading="lazy"
          unoptimized={true}
          alt="device card"
        />
      </div>
      <div className="title">{title}</div>
      <div className="content">{content}</div>
    </div>
  );
};

export default ItemCard;
