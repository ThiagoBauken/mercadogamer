import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Wrapper para renderizar componentes apenas no client-side
 * Útil para componentes que usam hooks que não funcionam durante SSR
 */
export function clientOnly<P extends object>(Component: ComponentType<P>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  });
}

export default clientOnly;
