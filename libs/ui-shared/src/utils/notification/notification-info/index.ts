import { ThemeColor } from '@theme/color';

export const NotificationInformation: {
  [key in NotificationActionType]: { icon?: string; color?: string };
} = {
  answer: { icon: 'message-sequare', color: ThemeColor.violet },
  ClaimReceive: { icon: 'close', color: ThemeColor.negative },
  newMessage: { icon: 'message-sequare', color: ThemeColor.positive },
  productAccepted: { icon: 'check-circle', color: ThemeColor.positive },
  productPaid: { icon: 'check-circle', color: ThemeColor.positive },
  productRejected: { icon: 'close', color: ThemeColor.negative },
  purchaseSuccess: { icon: 'check-circle', color: ThemeColor.positive },
  question: { icon: 'help-circle', color: ThemeColor.primary },
  receiveSuccess: { icon: 'dollar-circle', color: ThemeColor.violet },
  saleSuccess: { icon: 'check-circle', color: ThemeColor.positive },
};
