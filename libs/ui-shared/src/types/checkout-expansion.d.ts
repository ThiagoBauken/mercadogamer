interface CheckOutExpansionProps extends ChildrenProps {
  collapse?: boolean;
  defaultCollapse?: boolean;
  header?: React.ReactNode;
  price: number;
  onChangeStatus?: (collapse: boolean) => void;
}
