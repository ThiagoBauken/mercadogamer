interface ConversationModelType {
  id?: string;
  enabled?: boolean;
  referenceType?: 'users' | 'buyer' | 'seller';
  reference?: string;
  lastMessage?: string;
  users?: string[];
}
