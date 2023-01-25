interface ReviewModelType {
  id: string;
  body: string;
  qualification: number;
  order: OrderModelType;
  qualifier: UserModelType;
  qualified: UserModelType;
  roleReviewed: 'user' | 'seller';
  updatedAt: string;
}
