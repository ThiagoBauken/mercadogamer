import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { getFileFullUrl } from '../../../../../../../libs/ui-shared/src/utils';
import { ReactEventHandler } from 'react';
import { useWindowSize } from '../../../../../../../libs/ui-shared/src/hooks';
import Image from 'next/image';

interface IProps {
  games: GameModelType[];
  selectedGame: string;
  onClickGameCard: (game: GameModelType) => void;
}

export const GameCardFilter: React.FC<IProps> = ({ games, selectedGame, onClickGameCard }) => {
  const { width } = useWindowSize();
  const onImgError: ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
    currentTarget.src = '/assets/imgs/placeholder.svg';
    currentTarget.onerror = undefined;
  };

  const getClass = (game: GameModelType, index: number) => {
    const classes = [];

    if (selectedGame === game.name) {
      classes.push('selected');
    }

    if (width > 768) {
      if (index === games.length - 1) {
        classes.push('last-slide');
      } else if (index === 0) {
        classes.push('first-slide');
      }
    }

    return classes.join(' ');
  };

  return (
    <Swiper
      className="game-card-filter"
      modules={[Navigation]}
      navigation={width > 768}
      slidesPerView={'auto'}
      spaceBetween={20}
    >
      {width > 768 && (
        <>
          <div className="selector-fade selector-fade-left"></div>
          <div className="selector-fade selector-fade-right"></div>
        </>
      )}
      {games
        .filter((game) => game?.picture)
        .map((game, index) => {
          return (
            <SwiperSlide
              className={getClass(game, index)}
              key={index}
              onClick={() => onClickGameCard(game)}
            >
              <Image
                src={getFileFullUrl(`games/${game.id}.svg`)}
                onError={onImgError}
                layout="responsive"
                loading="lazy"
                width={100}
                height={60}
                unoptimized={true}
                alt="game filter"
                placeholder="blur"
                blurDataURL="blur"
              />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};
