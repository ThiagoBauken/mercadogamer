import { Button } from '@widgets/button';

type Props = {
  fileUrl: string;
  userImg?: string;
  axeImg?: string;
  gunImg?: string;
  weaponImg?: string;
  button?: string;
  onAction?: () => void;
};

const SkindSellCard: React.FC<Props> = (props) => {
  const { fileUrl, userImg, axeImg, gunImg, weaponImg, button } = props;

  return (
    <div className="skins-sell-section">
      <div
        className="skins-sell-card"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(27, 28, 35, 0.7) 0%, #1B1C23 81.47%), url('${fileUrl}')`,
        }}
      >
        <div className="first-divide">
          <img src={userImg} className="skin-user-img" alt="" />
          <img src={axeImg} className="skin-axe-img" />
        </div>
        <div className="second-divide">
          <img src={gunImg} className="skin-gun-img" />
          <img src={weaponImg} className="skin-weapon-img" />
          <div className="title">
            Ganá <span>dinero real</span> <br />
            vendiendo tus <span>Skins</span>
          </div>
          <div className="content">Cobrá con MercadoPago. Ventas seguras con garantía MG.</div>
          <Button onClick={props.onAction}>{button}</Button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SkindSellCard;
