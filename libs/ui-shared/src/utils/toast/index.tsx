import { toast } from 'react-toastify';
import { CustomToastContainer } from '@ui-shared/components/toast';

export const addMessageToToast = (
  message: string,
  option?: {
    status?: 'success' | 'error';
    icon?: string;
    actionName?: string;
    onAction?: () => void;
  }
): void => {
  const { status = 'success', icon = 'check-circle', actionName, onAction } = option || {};
  toast(
    <CustomToastContainer
      message={message}
      status={status}
      icon={icon}
      actionName={actionName}
      onAction={onAction}
    />,
    {
      // autoClose: false,
      hideProgressBar: true,
      closeButton: false,
      position: 'bottom-center',
    }
  );
};
