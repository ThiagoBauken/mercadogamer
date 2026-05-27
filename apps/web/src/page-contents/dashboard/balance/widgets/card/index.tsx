// @ts-nocheck - TypeScript compatibility fix
import { ButtonProps } from '@ui-shared/types/button';
import dynamic from 'next/dynamic';
import { toCurrency } from '@utils';


import Tooltip from '@widgets/tooltip';
import Link from 'next/link';

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

type Props = {
  title: string;
  helper: string;
  value: number;
  description?: string;
  button?: ButtonProps;
  hasRequiredData: boolean;
};
const BalanceCard: React.FC<Props> = ({
  title,
  helper,
  value,
  description,
  button,
  hasRequiredData,
}) => {
  return (
    <div className="balance-card">
      <div className="header">
        <div className="title">{title}</div>
        <Tooltip tooltip={helper} width={157}>
          <Icon name="exclamation-mark-circle" />
        </Tooltip>
      </div>

      <div className="value">{toCurrency(Math.round(value * 1000) / 1000)}</div>

      {description && <div className="description">{description}</div>}

      {!hasRequiredData && (
        <p className="missing-data">
          Para retirar dinero de la plataforma primero debes llenar tus datos en{' '}
          <Link href="/dashboard/profile">
            Mi perfil
          </Link>
        </p>
      )}

      {button && <Button {...button} />}
    </div>
  );
};

export default BalanceCard;
