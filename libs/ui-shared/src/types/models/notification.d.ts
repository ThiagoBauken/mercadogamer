type NotificationActionType =
  | 'question'
  | 'answer'
  | 'productPaid'
  | 'productRejected'
  | 'productAccepted'
  | 'newMessage'
  | 'purchaseSuccess'
  | 'saleSuccess'
  | 'ClaimReceive'
  | 'receiveSuccess';

interface NotificationModelType {
  id?: string;
  title?: string;
  description?: string;
  action?: NotificationActionType;
  user?: string;
  new?: boolean;
  payload?: any;
}
