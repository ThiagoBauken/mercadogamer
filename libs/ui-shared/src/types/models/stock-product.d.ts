enum RetirementTypesEnum {
  automatic = 'automatic',
  coordinated = 'coordinated',
}
type StockProductModelType = {
  id: string;
  status: 'sold' | 'available';
  retirementType: keyof typeof RetirementTypesEnum;
  code: string; // guardar encriptado TODO
  product: string | ProductModelType;
  order: string;
};
