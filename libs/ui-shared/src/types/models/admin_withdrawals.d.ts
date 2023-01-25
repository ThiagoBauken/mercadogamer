enum WithDrawalStatusEnum {
  'pending',
  'paid',
  'cancelled',
}
interface AdminWithDrawalModelType {
  id?: string;
  amount?: number;
  status?: keyof typeof WithDrawalStatusEnum;
  paymentMethod?: PaymentMethodModelType;
  userInfo?: string;
  taxId?: string;
  user?: AdminUserModelType;
  createdAt?: string;
}
