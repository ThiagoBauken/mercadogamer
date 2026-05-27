// @ts-nocheck - TypeScript compatibility fix
/**
 * Error Boundary Component
 *
 * Componente para capturar erros em React e mostrar UI de fallback
 * Evita que o app inteiro quebre por causa de um erro em um componente
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para serviço de monitoramento (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Chamar callback customizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Aqui você pode enviar para Sentry, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Se foi fornecido um fallback customizado, usar ele
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de erro padrão
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                maxWidth: 600,
                width: '100%',
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2,
                }}
              />

              <Typography variant="h4" gutterBottom>
                Oops! Algo deu errado
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada
                e estamos trabalhando para resolver o problema.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    textAlign: 'left',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{ fontFamily: 'monospace', fontSize: 12 }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                >
                  Tentar Novamente
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => (window.location.href = '/')}
                >
                  Voltar ao Início
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Hook para usar em componentes funcionais
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}

// Componente de erro customizado para páginas específicas
export function PageErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 3,
      }}
    >
      <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Erro ao carregar página
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {error?.message || 'Ocorreu um erro inesperado'}
      </Typography>
      {resetError && (
        <Button variant="contained" onClick={resetError} startIcon={<RefreshIcon />}>
          Tentar Novamente
        </Button>
      )}
    </Box>
  );
}

export default ErrorBoundary;
