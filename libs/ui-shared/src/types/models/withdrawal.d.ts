enum WithDrawalStatusEnum {
  'pending',
  'paid',
  'cancelled',
}
interface WithDrawalModelType {
  id?: string;
  amount?: number;
  status?: keyof typeof WithDrawalStatusEnum;
  paymentMethod?: PaymentMethodModelType;
  userInfo?: string;
  taxId?: string;
  user?: UserModelType;
}
