enum ProductStatusEnum {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

enum PublicationTypeEnum {
  'free',
  'normal',
  'pro',
}

enum ProductTypeEnum {
  game = 'game',
  giftCard = 'giftCard',
  item = 'item',
  coin = 'moneda',
  pack = 'pack',
}

type ProductModelType = {
  id?: string;
  countries?: string;
  featured?: boolean;
  enabled?: boolean;
  name?: string;
  picture?: string;
  description?: string;
  price?: number;
  totalStock?: number;
  stock?: number;
  sold?: number;
  commission?: number;
  iva?: number;
  priceWithDiscount?: number;
  sellerProfit?: number;
  discount?: boolean;
  priority?: number;
  type?: keyof typeof ProductTypeEnum;
  status?: keyof typeof ProductStatusEnum;
  publicationType?: keyof typeof PublicationTypeEnum;
  platform?: PlatformModelType;
  category?: string | CategoryModelType;
  game?: GameModelType;
  user?: UserModelType;
  rejectedmessages?: RejectedMessagesType[];
  stockProduct?: StockProductModelType | StockProductModelType[];
  types?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type CreateProductModelType = {
  id?: string;
  featured?: boolean;
  enabled?: boolean;
  name?: string;
  picture?: string;
  description?: string;
  price?: number;
  totalStock?: number;
  stock?: number;
  sold?: number;
  commission?: number;
  iva?: number;
  priceWithDiscount?: number;
  sellerProfit?: number;
  discount?: boolean;
  priority?: number;
  type?: string;
  status?: string;
  publicationType?: keyof typeof PublicationTypeEnum;
  platform?: string;
  category?: string;
  game?: string;
  user?: string;
  stockProduct?: string;
  retirementType?: string;
  code?: any;
};
