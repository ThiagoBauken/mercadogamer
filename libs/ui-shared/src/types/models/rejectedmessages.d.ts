interface RejectedMessagesType {
  map(arg0: (item: any) => JSX.Element): React.ReactNode;
  id?: string;
  body?: string;
  user?:UserModelType;
  product?: ProductModelType;
}
