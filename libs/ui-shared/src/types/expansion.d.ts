interface ExpansionProps extends ChildrenProps {
  contentClass?: string;
  collapse?: boolean;
  defaultCollapse?: boolean;
  header?: React.ReactNode;
  hideOnDesktop?: boolean;
  onChangeStatus?: (collapse: boolean) => void;
}
