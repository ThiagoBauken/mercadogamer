interface UserProfileResponse {
  user: UserModelType;
  products: ProductModelType[];
  userReviews: ReviewModelType[];
  sellerReviews: ReviewModelType[];
  categories: CategoryModelType[];
  productsPages: number;
  orders: OrderModelType[];
  finishedSales: number;
}
