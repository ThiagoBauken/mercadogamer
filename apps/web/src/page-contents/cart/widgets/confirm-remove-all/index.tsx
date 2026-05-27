// @ts-nocheck - TypeScript compatibility fix
import { useTranslation } from 'next-i18next';
import { ThemeColor } from '@theme/color';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });




const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
const ConfirmRemoveAll: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation('cart');

  return (
    <Modal open={open} onClose={onClose} contentClass="confirm-remove-all">
      <div className="icon">
        <Icon name="trash"></Icon>
      </div>
      <div className="message">{t('confirm_empty.title')}</div>
      <div className="action">
        <Button size="big" bgColor={ThemeColor.negative} onClick={onConfirm}>
          {t('actions.empty_cart')}
        </Button>
        <Button size="big" bgColor={ThemeColor.negative} kind="secondary" onClick={onClose}>
          {t('common:cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmRemoveAll;
