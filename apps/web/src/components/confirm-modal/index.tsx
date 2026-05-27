import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Checkbox = dynamic(() => import('@widgets/checkbox').then(mod => mod.Checkbox), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

type Props = {
  open: boolean;
  onAction: () => void;
  onClose: () => void;
};
const ConfirmModal: React.FC<Props> = ({ open, onAction, onClose }) => {
  const { t } = useTranslation('common');
  const [state, setState] = useState<{ checked: boolean }>({ checked: false });
  return (
    <Modal
      open={open}
      width={450}
      header={t('modals.confirm_transaction.title')}
      contentClass="finalize-transaction-modal"
      onClose={onClose}
    >
      <div className="description">
        {t('modals.confirm_transaction.description')}
      </div>

      <Checkbox
        checked={state.checked}
        onChange={(value) => setState({ ...state, checked: value })}
      >
        {t('modals.confirm_transaction.checkbox_label')}
      </Checkbox>

      <Button full onClick={onAction} disabled={!state.checked}>
        {t('modals.confirm_transaction.button')}
      </Button>
    </Modal>
  );
};

export default ConfirmModal;
