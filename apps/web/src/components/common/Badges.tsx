// @ts-nocheck - TypeScript strict mode compatibility issues with Material-UI components
/**
 * Badges Component
 *
 * Componentes de badges visuais para produtos, usuários e status
 * Aumenta conversão e confiança visual
 */

import React from 'react';
import { Chip, Box, Tooltip, Typography } from '@mui/material';
import {
  Verified as VerifiedIcon,
  LocalFireDepartment as FireIcon,
  Bolt as BoltIcon,
  LocalShipping as ShippingIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  LocalOffer as OfferIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

// Badge de Verificado
export function VerifiedBadge({
  level = 1,
  size = 'medium',
  showLabel = true,
}: {
  level?: 1 | 2 | 3;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}) {
  const config = {
    1: { label: 'Verificado', color: '#1976d2', icon: '🔵' },
    2: { label: 'Identidade Verificada', color: '#2e7d32', icon: '🟢' },
    3: { label: 'Vendedor Certificado', color: '#f57c00', icon: '🏆' },
  };

  const { label, color, icon } = config[level];

  return (
    <Tooltip title={label}>
      <Chip
        icon={<VerifiedIcon />}
        label={showLabel ? label : icon}
        size={size}
        sx={{
          bgcolor: `${color}22`,
          color: color,
          fontWeight: 600,
          '& .MuiChip-icon': { color: color },
        }}
      />
    </Tooltip>
  );
}

// Badge de Promoção
export function PromoBadge({
  discount,
  size = 'medium',
}: {
  discount?: number;
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <Chip
      icon={<FireIcon />}
      label={discount ? `${discount}% OFF` : 'PROMOÇÃO'}
      size={size}
      color="error"
      sx={{
        fontWeight: 700,
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      }}
    />
  );
}

// Badge de Entrega Imediata
export function FastDeliveryBadge({ size = 'medium' }: { size?: 'small' | 'medium' }) {
  return (
    <Chip
      icon={<BoltIcon />}
      label="ENTREGA IMEDIATA"
      size={size}
      sx={{
        bgcolor: '#ff9800',
        color: 'white',
        fontWeight: 600,
        '& .MuiChip-icon': { color: 'white' },
      }}
    />
  );
}

// Badge de Frete Grátis
export function FreeShippingBadge({ size = 'medium' }: { size?: 'small' | 'medium' }) {
  return (
    <Chip
      icon={<ShippingIcon />}
      label="FRETE GRÁTIS"
      size={size}
      color="success"
      sx={{ fontWeight: 600 }}
    />
  );
}

// Badge de Top Seller
export function TopSellerBadge({ size = 'medium' }: { size?: 'small' | 'medium' }) {
  return (
    <Chip
      icon={<TrophyIcon />}
      label="TOP SELLER"
      size={size}
      sx={{
        bgcolor: '#ffd700',
        color: '#000',
        fontWeight: 700,
      }}
    />
  );
}

// Badge de Melhor Avaliado
export function BestRatedBadge({
  rating,
  size = 'medium',
}: {
  rating?: number;
  size?: 'small' | 'medium';
}) {
  return (
    <Chip
      icon={<StarIcon />}
      label={rating ? `${rating}/5` : 'MELHOR AVALIADO'}
      size={size}
      sx={{
        bgcolor: '#9c27b0',
        color: 'white',
        fontWeight: 600,
        '& .MuiChip-icon': { color: '#ffd700' },
      }}
    />
  );
}

// Badge de Resposta Rápida
export function FastResponseBadge({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <Tooltip title="Responde em menos de 1 hora">
      <Chip
        icon={<SpeedIcon />}
        label="RESPOSTA RÁPIDA"
        size={size}
        variant="outlined"
        sx={{ fontWeight: 600, borderColor: '#1976d2', color: '#1976d2' }}
      />
    </Tooltip>
  );
}

// Badge de Novo
export function NewBadge({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <Chip
      label="NOVO"
      size={size}
      sx={{
        bgcolor: '#00bcd4',
        color: 'white',
        fontWeight: 700,
      }}
    />
  );
}

// Badge de Destaque
export function FeaturedBadge({ size = 'medium' }: { size?: 'small' | 'medium' }) {
  return (
    <Chip
      icon={<OfferIcon />}
      label="DESTAQUE"
      size={size}
      sx={{
        bgcolor: '#e91e63',
        color: 'white',
        fontWeight: 700,
        '& .MuiChip-icon': { color: 'white' },
      }}
    />
  );
}

// Badge de Garantia
export function WarrantyBadge({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <Tooltip title="Produto com garantia">
      <Chip
        icon={<SecurityIcon />}
        label="GARANTIA"
        size={size}
        color="info"
        sx={{ fontWeight: 600 }}
      />
    </Tooltip>
  );
}

// Badge de Produto Verificado
export function VerifiedProductBadge({ size = 'small' }: { size?: 'small' | 'medium' }) {
  return (
    <Tooltip title="Produto verificado pela equipe">
      <Chip
        icon={<CheckIcon />}
        label="VERIFICADO"
        size={size}
        color="success"
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    </Tooltip>
  );
}

// Container de Badges (para agrupar múltiplos badges)
export function BadgeContainer({
  badges,
  spacing = 1,
}: {
  badges: React.ReactNode[];
  spacing?: number;
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: spacing }}>
      {badges.map((badge, index) => (
        <Box key={index}>{badge}</Box>
      ))}
    </Box>
  );
}

// Badge Customizado
export function CustomBadge({
  label,
  icon,
  color = 'primary',
  variant = 'filled',
  size = 'medium',
}: {
  label: string;
  icon?: React.ReactElement;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
}) {
  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      variant={variant}
      size={size}
      sx={{ fontWeight: 600 }}
    />
  );
}

// Badge de Status de Pedido
export function OrderStatusBadge({
  status,
  size = 'medium',
}: {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  size?: 'small' | 'medium';
}) {
  const config = {
    pending: { label: 'Pendente', color: 'warning' as const },
    processing: { label: 'Processando', color: 'info' as const },
    shipped: { label: 'Enviado', color: 'primary' as const },
    delivered: { label: 'Entregue', color: 'success' as const },
    cancelled: { label: 'Cancelado', color: 'error' as const },
  };

  const { label, color } = config[status];

  return <Chip label={label} color={color} size={size} sx={{ fontWeight: 600 }} />;
}

// Badge com contador (notificações, mensagens, etc.)
export function CounterBadge({
  count,
  max = 99,
  color = 'error',
}: {
  count: number;
  max?: number;
  color?: 'error' | 'primary' | 'secondary' | 'success';
}) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Box
      sx={{
        bgcolor: `${color}.main`,
        color: 'white',
        borderRadius: '50%',
        minWidth: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        px: 0.5,
      }}
    >
      {displayCount}
    </Box>
  );
}

// Badge de nível de usuário (gamificação)
export function UserLevelBadge({
  level,
  size = 'medium',
}: {
  level: number;
  size?: 'small' | 'medium';
}) {
  const getLevelColor = (lvl: number) => {
    if (lvl < 10) return '#9e9e9e'; // Cinza
    if (lvl < 25) return '#8bc34a'; // Verde
    if (lvl < 50) return '#2196f3'; // Azul
    if (lvl < 75) return '#9c27b0'; // Roxo
    return '#ffd700'; // Dourado
  };

  return (
    <Chip
      label={`Nível ${level}`}
      size={size}
      sx={{
        bgcolor: getLevelColor(level),
        color: 'white',
        fontWeight: 700,
      }}
    />
  );
}

export default {
  Verified: VerifiedBadge,
  Promo: PromoBadge,
  FastDelivery: FastDeliveryBadge,
  FreeShipping: FreeShippingBadge,
  TopSeller: TopSellerBadge,
  BestRated: BestRatedBadge,
  FastResponse: FastResponseBadge,
  New: NewBadge,
  Featured: FeaturedBadge,
  Warranty: WarrantyBadge,
  VerifiedProduct: VerifiedProductBadge,
  Container: BadgeContainer,
  Custom: CustomBadge,
  OrderStatus: OrderStatusBadge,
  Counter: CounterBadge,
  UserLevel: UserLevelBadge,
};
