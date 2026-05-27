// @ts-nocheck - TypeScript compatibility fix
/**
 * Loading Skeleton Components
 *
 * Componentes de loading state para melhorar UX durante carregamentos
 */

import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';

// Skeleton para Card de Produto
export function ProductCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={24} width="60%" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="text" height={28} width={100} />
          <Skeleton variant="rectangular" height={36} width={120} />
        </Box>
      </CardContent>
    </Card>
  );
}

// Skeleton para Lista de Produtos
export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

// Skeleton para Detalhes do Produto
export function ProductDetailSkeleton() {
  return (
    <Grid container spacing={4}>
      {/* Imagens */}
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={400} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={80} height={80} />
          ))}
        </Box>
      </Grid>

      {/* Informações */}
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" height={48} width="90%" />
        <Skeleton variant="text" height={32} width="70%" />
        <Box sx={{ my: 3 }}>
          <Skeleton variant="rectangular" height={60} />
        </Box>
        <Skeleton variant="text" height={24} width="40%" />
        <Skeleton variant="text" height={24} width="60%" />
        <Skeleton variant="text" height={24} width="50%" />
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="rectangular" height={48} />
        </Box>
      </Grid>
    </Grid>
  );
}

// Skeleton para Perfil de Usuário
export function UserProfileSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Skeleton variant="text" height={32} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={100} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" height={24} width="30%" />
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={24} width="35%" />
        </Box>
      </CardContent>
    </Card>
  );
}

// Skeleton para Tabela
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            gap: 2,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="rectangular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
      ))}
    </Box>
  );
}

// Skeleton para Chat
export function ChatSkeleton({ messages = 5 }: { messages?: number }) {
  return (
    <Box>
      {Array.from({ length: messages }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
            mb: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={index % 2 === 0 ? '60%' : '70%'}
            height={60}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      ))}
    </Box>
  );
}

// Skeleton para Dashboard Cards
export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" height={24} width={120} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Skeleton variant="text" height={48} width={150} />
        <Skeleton variant="text" height={20} width={100} />
      </CardContent>
    </Card>
  );
}

// Skeleton Genérico
export function GenericSkeleton({
  variant = 'rectangular',
  width = '100%',
  height = 200,
}: {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
}) {
  return <Skeleton variant={variant} width={width} height={height} />;
}

export default {
  ProductCard: ProductCardSkeleton,
  ProductList: ProductListSkeleton,
  ProductDetail: ProductDetailSkeleton,
  UserProfile: UserProfileSkeleton,
  Table: TableSkeleton,
  Chat: ChatSkeleton,
  DashboardCard: DashboardCardSkeleton,
  Generic: GenericSkeleton,
};
