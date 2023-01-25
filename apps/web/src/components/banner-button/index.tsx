import Image from 'next/image';

type Props = {
  imgUrl: string;
  text: string;
  border?: boolean;
};

const BannerButton: React.FC<Props> = ({ imgUrl, text, border }) => {
  return (
    <div className={`mercado-banner-button${!border ? ' no-border' : ''}`}>
      <div>
        <Image src={imgUrl} width={35} height={35} loading="lazy" unoptimized={true} alt="icon" />
      </div>
      <span>{text}</span>
    </div>
  );
};

export default BannerButton;
