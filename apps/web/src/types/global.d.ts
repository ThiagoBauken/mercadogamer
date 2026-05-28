// Global type definitions for the application

interface NotificationModelType {
  id: string | number;
  title: string;
  description: string;
  new: boolean;
  action: string;
  payload?: {
    id: string | number;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface NavItem {
  label: string;
  icon: string | React.ReactNode;
  url: string;
  role?: string;
}

interface UserModelType {
  id: string | number;
  username: string;
  picture?: string;
  balance?: number;
  gift?: number;
  hasFirstVisitVendor?: boolean;
  firstRoulettePlay?: boolean;
  referrerUsedTheDrop?: boolean;
  kycLevel?: number;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  verifiedCPF?: boolean;
  [key: string]: any;
}

interface TicketModelType {
  id?: string | number;
  user?: string | number;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface OrderModelType {
  id?: string | number;
  user?: string | number;
  status?: string;
  [key: string]: any;
}

interface FeedbackModelType {
  title?: string;
  body?: string;
  [key: string]: any;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProductModelType {
  id?: string | number;
  name?: string;
  picture?: string;
  game?: {
    picture?: string;
    [key: string]: any;
  };
  stockProduct?: {
    retirementType?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface DeviceCardModelType {
  title?: string;
  content?: string;
  button?: string;
  img?: string;
  icon?: string;
  [key: string]: any;
}
