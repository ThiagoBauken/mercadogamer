interface GameModelType {
  id?: string;
  name?: string;
  picture?: string;
  types?: keyof typeof ProductTypeEnum;
  enabled?: boolean;
  product?: ProductModelType;
}
