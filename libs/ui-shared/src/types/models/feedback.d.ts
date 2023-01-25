interface FeedbackModelType {
  id?: string;
  title?: string;
  body?: string;
  files?: [string];
  user?: UserModelType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
