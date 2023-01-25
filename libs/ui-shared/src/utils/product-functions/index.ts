import { ThemeColor } from '@theme/color';
import { products } from '../common';

export const getProductDelivery = (
  product: ProductModelType | OrderModelType
): 'automatic' | 'manual' =>
  !Array.isArray(product?.stockProduct) && product?.stockProduct?.retirementType === 'automatic'
    ? 'automatic'
    : 'manual';

export const getProductPrice = (product: ProductModelType): number =>
  product?.discount ? product.priceWithDiscount : product?.price;

export const ProductStatusCardInfo: {
  [key in ProductStatusEnum]: { label: string; color: string };
} = {
  approved: {
    label: 'Publicado',
    color: ThemeColor.positive,
  },
  pending: {
    label: 'Pendiente',
    color: ThemeColor['gray-60'],
  },
  rejected: {
    label: 'Rechazado',
    color: ThemeColor.negative,
  },
};

export const caculateCommission = (
  price = 0,
  type: keyof typeof PublicationTypeEnum
): { commission: number; iva: number; sellerProfit: number } => {
  const commission = (price * products.publicationType[type]?.commission) / 100;
  const iva = (products.publicationType[type]?.iva * commission) / 100;
  const sellerProfit = price - (commission + iva);
  return { commission, iva, sellerProfit };
};

export const PublicationTypes: IPublicationCard[] = [
  {
    value: 'free',
    icon: 'tag',
    label: 'Gratuita',
    description: 'Sin comisión',
    detail: 'Solo 1 vez',
  },
  {
    value: 'normal',
    icon: 'star-outline',
    label: 'Normal',
    description: `Comisión de ${products.publicationType.normal.commission}% + IVA (8,47%)`,
    detail: ['Mejor posición en busquedas que las publicaciones gratuitas', 'Producto recomendado'],
  },
  {
    value: 'pro',
    icon: 'award',
    label: 'Pro',
    description: `Comisión de ${products.publicationType.pro.commission}% + IVA (12,1%)`,
    detail: [
      'Mejor posición en busquedas',
      'Mayor recomendación del producto',
      'Potencial producto publicitado',
      'Posibilidad de estar en el inicio',
    ],
  },
];

export function verifyProduct(product: CreateProductModelType) {
  const checks = [
    [product.name, 'El producto debe tener un nombre'],
    [product.description, 'El producto debe tener una descripcion'],
    [product.category, 'El producto debe tener una tipo asignado'],
    [product.platform, 'El producto debe tener una plataforma asginada'],
    [product.category, 'El producto debe tener una categoria asignada'],
    [product.retirementType, 'El producto debe tener un tipo de entrega asignada'],
  ];

  checks.forEach(([field, message]) => {
    if (!field || field.length === 0) throw new Error(message);
  });

  if (product.retirementType === 'coordinated' && product.stock < 0) {
    product.stock = 0;
  }

  if (product.price <= 0) throw new Error('El precio de un producto debe ser mayor que $0');

  if (product.price > 100000) {
    throw new Error('El precio del producto debe ser menor a USD 100000');
  }
}
