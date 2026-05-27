// @ts-nocheck - TypeScript compatibility fix
import { ThemeColor } from '@theme/color';
import dynamic from 'next/dynamic';



import { useTranslation } from 'next-i18next';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ProductDeleteModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation('common');

  return (
    <Modal open={open} onClose={onClose} contentClass="delete-product-modal">
      <div className="icon">
        <Icon name="trash"></Icon>
      </div>
      <div className="message">{t('modals.delete_product.message')}</div>
      <div className="action">
        <Button size="big" bgColor={ThemeColor.negative} onClick={onConfirm}>
          {t('modals.delete_product.confirm_button')}
        </Button>
        <Button size="big" bgColor={ThemeColor.negative} kind="secondary" onClick={onClose}>
          {t('modals.delete_product.cancel_button')}
        </Button>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;
