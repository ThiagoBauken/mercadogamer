import { Button } from '@widgets/button';

type Props = {
  fileUrl: string;
  image?: string;
  button?: string;
  onAction?: () => void;
};

const VendorSellCard: React.FC<Props> = (props) => {
  const { fileUrl, image, button } = props;

  return (
    <div
      className="vendor-sell-section"
      style={{
        backgroundImage: `url('${fileUrl}')`,
      }}
    >
      <div className="vendor-sell-card">
        <div className="action">
          <div>
            <div className="title">
              Comenzá a <span>vender hoy</span>
            </div>
            <div className="content">
              Realizá tu primera publicación gratis y ganá dinero con tus items digitales.
            </div>
            <Button onClick={props.onAction}>{button}</Button>
          </div>
        </div>
        <div className="image">
          <img src={image} className="vendor-img" />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default VendorSellCard;
