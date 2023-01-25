interface ProductQAModelType {
  id?: string | unmber;
  answer?: string;
  question?: string;
  buyer?: string | UserModelType;
  seller?: string | UserModelType;
  product?: ProductModelType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: any;
}
