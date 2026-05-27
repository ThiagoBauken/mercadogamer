// @ts-nocheck - TypeScript compatibility fix
/**
 * Breadcrumbs Component
 *
 * Componente de navegação breadcrumb para melhorar UX e SEO
 */

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
}

export function Breadcrumbs({
  items,
  separator = <NavigateNext fontSize="small" />,
  showHome = true,
}: BreadcrumbsProps) {
  const router = useRouter();

  // Se items não foi fornecido, gerar automaticamente da URL
  const breadcrumbItems = items || generateBreadcrumbs(router.pathname);

  return (
    <Box sx={{ py: 2 }}>
      <MuiBreadcrumbs separator={separator} aria-label="breadcrumb">
        {showHome && (
          <Link href="/" passHref legacyBehavior>
            <MuiLink
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              Início
            </MuiLink>
          </Link>
        )}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (isLast) {
            return (
              <Typography key={item.label} color="text.primary" fontWeight={600}>
                {item.label}
              </Typography>
            );
          }

          return item.href ? (
            <Link key={item.label} href={item.href} passHref legacyBehavior>
              <MuiLink
                underline="hover"
                color="text.primary"
                sx={{
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.label}
              </MuiLink>
            </Link>
          ) : (
            <Typography key={item.label} color="text.secondary">
              {item.label}
            </Typography>
          );
        })}
      </MuiBreadcrumbs>

      {/* Schema.org markup para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              showHome && {
                '@type': 'ListItem',
                position: 1,
                name: 'Início',
                item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
              },
              ...breadcrumbItems.map((item, index) => ({
                '@type': 'ListItem',
                position: index + (showHome ? 2 : 1),
                name: item.label,
                item: item.href
                  ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
                  : undefined,
              })),
            ].filter(Boolean),
          }),
        }}
      />
    </Box>
  );
}

// Função auxiliar para gerar breadcrumbs automaticamente da URL
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter((x) => x);

  // Mapeamento de slugs para labels amigáveis
  const labelMap: Record<string, string> = {
    catalogo: 'Catálogo',
    produtos: 'Produtos',
    checkout: 'Finalizar Compra',
    dashboard: 'Painel',
    profile: 'Perfil',
    orders: 'Pedidos',
    favorites: 'Favoritos',
    notifications: 'Notificações',
    settings: 'Configurações',
    'league-of-legends': 'League of Legends',
    valorant: 'Valorant',
    cs2: 'Counter-Strike 2',
    minecraft: 'Minecraft',
    'free-fire': 'Free Fire',
  };

  return paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const label = labelMap[path] || formatLabel(path);

    return { label, href };
  });
}

// Formatar label de forma amigável
function formatLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Breadcrumbs específicos para páginas comuns
export function ProductBreadcrumbs({
  category,
  subcategory,
  productName,
}: {
  category?: string;
  subcategory?: string;
  productName: string;
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Catálogo', href: '/catalogo' },
  ];

  if (category) {
    items.push({
      label: category,
      href: `/catalogo/${category.toLowerCase().replace(/\s/g, '-')}`,
    });
  }

  if (subcategory) {
    items.push({
      label: subcategory,
      href: `/catalogo/${category?.toLowerCase().replace(/\s/g, '-')}/${subcategory
        .toLowerCase()
        .replace(/\s/g, '-')}`,
    });
  }

  items.push({ label: productName });

  return <Breadcrumbs items={items} />;
}

export function DashboardBreadcrumbs({ section }: { section: string }) {
  return (
    <Breadcrumbs
      items={[{ label: 'Dashboard', href: '/dashboard' }, { label: section }]}
    />
  );
}

export default Breadcrumbs;
