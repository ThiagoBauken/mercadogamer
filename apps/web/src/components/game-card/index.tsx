import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import Image from 'next/image';

type Props = {
  games: GameCardModelType;
  onAction: () => void;
};

const GameCard: React.FC<Props> = ({ games, onAction }) => {
  return (
    <div
      className="individual-games-card"
      onClick={onAction}
      style={{ width: '180px', height: '240px', position: 'relative' }}
    >
      <Image
        src={getFileFullUrl(`games/${games?.id}.webp`)}
        layout="responsive"
        loading="lazy"
        width={180}
        height={240}
        unoptimized={true}
        alt="product"
        placeholder="blur"
        blurDataURL="blur"
        sizes="(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw"
      />
    </div>
  );
};

export default GameCard;
