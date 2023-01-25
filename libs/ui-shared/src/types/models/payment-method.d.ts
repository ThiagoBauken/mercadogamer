enum PaymentMethodTypeEnum {
  'mercadoPago',
  'bankTransfer',
}
interface PaymentMethodModelType {
  id?: string;
  identifier?: string;
  type?: keyof typeof PaymentMethodTypeEnum;
  user?: UserModelType;
  enabled?: boolean;
}
