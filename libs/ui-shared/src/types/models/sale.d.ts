interface SaleModelType {
  id?: string;
  status?: keyof typeof OrderModelStatusEnum;
  claimDate?: string | Date;
  paidDate?: string | Date;
  cancelDate?: string | Date;
  returnedDate?: string | Date;
  paymentMethod?: 'mercadoPago' | 'giftbalance';
  discountCode?: string;
  stockProduct?: StockProductModelType;
  product?: ProductModelType;
  buyer?: UserModelType;
  seller?: UserModelType;
  withdrawal?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  postalCode?: number;
  phoneNumber?: number;
  address?: string;
  processingFees?: number;
  productPrice?: number;
  country?: CountryModelType;
  pricePaid?: number;
  sellerProfit?: number;
  discountCodePrice?: number;
  toUSD?: number;
  number?: number;
  initPoint?: any;
  firstSale?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // custom
  hasUnreadMessage?: boolean;
}
