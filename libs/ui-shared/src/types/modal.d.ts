interface ModalProps extends ChildrenProps {
  open: boolean;
  contentClass?: string;
  header?: React.ReactNode;
  width?: string | number;
  onClose?: () => void;
}
