interface IPublicationCard {
  value: keyof typeof PublicationTypeEnum;
  icon: string;
  label: string;
  description: string;
  detail?: React.ReactNode | React.ReactNode[];
}
