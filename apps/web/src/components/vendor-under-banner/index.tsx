import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = {
  fileUrl: string;
  image?: string;
  button?: string;
  onAction?: () => void;
};

const VendorSellCard: React.FC<Props> = (props) => {
  const { t } = useTranslation('vendors');
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
            <div className="title" dangerouslySetInnerHTML={{ __html: t('hero.title') }}>
            </div>
            <div className="content">
              Realizá tu primeira publicación gratis y ganá dinero con tus items digitales.
            </div>
            <Button onClick={props.onAction}>{button}</Button>
          </div>
        </div>
        <div className="image">
          <img src={image} className="vendor-img" alt="Vendor banner" />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default VendorSellCard;
