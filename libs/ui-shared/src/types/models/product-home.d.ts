enum HomeProductSectionEnum {
  'tendencia',
  'skin',
  'juego',
}

interface HomeProductType {
  sectionId?: keyof typeof HomeProductSectionEnum;
  product?: ProductModelType;
  orderId?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
