enum TicketStatusEnum {
  'pending',
  'finished',
}
interface TicketModelType {
  id?: string;
  title?: string;
  body?: string;
  answer?: string;
  files?: [string];
  status?: keyof typeof TicketStatusEnum;
  user?: UserModelType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
