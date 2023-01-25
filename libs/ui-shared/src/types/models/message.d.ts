interface MessageModelType {
  id?: string;
  body?: string;
  authorName?: string;
  read?: boolean;
  author?: UserModelType;
  conversation?: ConversationModelType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
