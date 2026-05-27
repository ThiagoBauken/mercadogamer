// @ts-nocheck - TypeScript strict mode compatibility issues with Material-UI components
/**
 * Advanced Filters Component
 *
 * Componente de filtros avançados para busca de produtos
 * Inclui filtros por verificação, entrega, pagamento, etc.
 */

import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export interface FilterValues {
  // Verificação
  verifiedOnly: boolean;
  verifiedSeller: boolean;
  certifiedSeller: boolean;

  // Entrega
  immediateDelivery: boolean;
  freeShipping: boolean;

  // Pagamento
  acceptsInstallments: boolean;
  acceptsPix: boolean;

  // Preço
  minPrice: number;
  maxPrice: number;

  // Avaliação
  minRating: number;

  // Ordenação
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_rated';

  // Categorias
  categories: string[];

  // Plataformas
  platforms: string[];
}

interface AdvancedFiltersProps {
  initialValues?: Partial<FilterValues>;
  onFiltersChange: (filters: FilterValues) => void;
  onClear?: () => void;
}

const defaultFilters: FilterValues = {
  verifiedOnly: false,
  verifiedSeller: false,
  certifiedSeller: false,
  immediateDelivery: false,
  freeShipping: false,
  acceptsInstallments: false,
  acceptsPix: false,
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  sortBy: 'relevance',
  categories: [],
  platforms: [],
};

export function AdvancedFilters({
  initialValues,
  onFiltersChange,
  onClear,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    ...defaultFilters,
    ...initialValues,
  });

  const handleChange = (field: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onClear?.();
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minPrice' || key === 'maxPrice' || key === 'sortBy') return false;
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.length > 0;
    return value !== defaultFilters[key as keyof FilterValues];
  }).length;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon />
          <Typography variant="h6">Filtros</Typography>
          {activeFiltersCount > 0 && (
            <Chip label={activeFiltersCount} size="small" color="primary" />
          )}
        </Box>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<CloseIcon />}
            onClick={handleClear}
          >
            Limpar
          </Button>
        )}
      </Box>

      {/* Ordenação */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Ordenar por</FormLabel>
        <RadioGroup
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
        >
          <FormControlLabel
            value="relevance"
            control={<Radio size="small" />}
            label="Relevância"
          />
          <FormControlLabel
            value="price_asc"
            control={<Radio size="small" />}
            label="Menor preço"
          />
          <FormControlLabel
            value="price_desc"
            control={<Radio size="small" />}
            label="Maior preço"
          />
          <FormControlLabel
            value="newest"
            control={<Radio size="small" />}
            label="Mais novos"
          />
          <FormControlLabel
            value="best_rated"
            control={<Radio size="small" />}
            label="Melhor avaliados"
          />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Verificação e Confiança */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>✅ Verificação e Confiança</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleChange('verifiedOnly', e.target.checked)}
                />
              }
              label="Apenas produtos verificados"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verifiedSeller}
                  onChange={(e) => handleChange('verifiedSeller', e.target.checked)}
                />
              }
              label="Vendedor verificado"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.certifiedSeller}
                  onChange={(e) => handleChange('certifiedSeller', e.target.checked)}
                />
              }
              label="Vendedor certificado 🏆"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Entrega */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>🚀 Entrega</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.immediateDelivery}
                  onChange={(e) => handleChange('immediateDelivery', e.target.checked)}
                />
              }
              label="Entrega imediata ⚡"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.freeShipping}
                  onChange={(e) => handleChange('freeShipping', e.target.checked)}
                />
              }
              label="Frete grátis"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Pagamento */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>💳 Pagamento</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.acceptsInstallments}
                  onChange={(e) =>
                    handleChange('acceptsInstallments', e.target.checked)
                  }
                />
              }
              label="Aceita parcelamento"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.acceptsPix}
                  onChange={(e) => handleChange('acceptsPix', e.target.checked)}
                />
              }
              label="Aceita PIX"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Faixa de Preço */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>💰 Faixa de Preço</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(_, newValue) => {
                const [min, max] = newValue as number[];
                handleChange('minPrice', min);
                handleChange('maxPrice', max);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `R$ ${value}`}
              min={0}
              max={10000}
              step={50}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Mínimo"
                type="number"
                size="small"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                InputProps={{ startAdornment: 'R$' }}
              />
              <TextField
                label="Máximo"
                type="number"
                size="small"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                InputProps={{ startAdornment: 'R$' }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Avaliação Mínima */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>⭐ Avaliação</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <RadioGroup
              value={filters.minRating}
              onChange={(e) => handleChange('minRating', Number(e.target.value))}
            >
              <FormControlLabel
                value={0}
                control={<Radio size="small" />}
                label="Todas as avaliações"
              />
              <FormControlLabel
                value={4}
                control={<Radio size="small" />}
                label="⭐⭐⭐⭐ 4+ estrelas"
              />
              <FormControlLabel
                value={4.5}
                control={<Radio size="small" />}
                label="⭐⭐⭐⭐⭐ 4.5+ estrelas"
              />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

// Componente de Active Filters (chips)
export function ActiveFilters({
  filters,
  onRemove,
}: {
  filters: Partial<FilterValues>;
  onRemove: (key: keyof FilterValues) => void;
}) {
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy') return false;
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.length > 0;
    return false;
  });

  if (activeFilters.length === 0) return null;

  const labels: Record<string, string> = {
    verifiedOnly: 'Apenas verificados',
    verifiedSeller: 'Vendedor verificado',
    certifiedSeller: 'Vendedor certificado',
    immediateDelivery: 'Entrega imediata',
    freeShipping: 'Frete grátis',
    acceptsInstallments: 'Parcelamento',
    acceptsPix: 'PIX',
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
        Filtros ativos:
      </Typography>
      {activeFilters.map(([key]) => (
        <Chip
          key={key}
          label={labels[key] || key}
          onDelete={() => onRemove(key as keyof FilterValues)}
          size="small"
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  );
}

export default AdvancedFilters;
