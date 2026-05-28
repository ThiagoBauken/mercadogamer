// @ts-nocheck - TypeScript strict mode compatibility issues with Material-UI components
import React from 'react';
import { VerifiedBadge } from './Badges';

interface Props {
  seller?: {
    kycLevel?: number;
    verifiedCPF?: boolean;
    verifiedEmail?: boolean;
    verifiedPhone?: boolean;
  };
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

/**
 * Wrapper que decide qual nível de selo mostrar:
 *   kycLevel >= 3 → "Vendedor Certificado" (level 3 amarelo)
 *   kycLevel >= 2 → "Identidade Verificada" (level 2 verde)
 *   kycLevel >= 1 → "Verificado" (level 1 azul)
 *   kycLevel === 0 → não renderiza nada (componente retorna null)
 */
export function VerifiedSellerBadge({ seller, size = 'small', showLabel = false }: Props) {
  if (!seller || !seller.kycLevel || seller.kycLevel < 1) return null;
  const level = Math.min(Math.max(seller.kycLevel, 1), 3) as 1 | 2 | 3;
  return <VerifiedBadge level={level} size={size} showLabel={showLabel} />;
}

export default VerifiedSellerBadge;
