# ACOES CORRETIVAS PRIORITARIAS - MERCADOGAMER

Este documento lista os problemas encontrados por ordem de prioridade com solucoes praticas e codigo de exemplo.

---

## PRIORIDADE 1 - CRITICA (Resolver HOJE)

### 1. HOME PAGE TIMEOUT - Pagina nao carrega

**Problema:** A home page excede timeout de 30s e nunca completa o carregamento.

**Causa Provavel:**
- Requisicoes a API que nao retornam
- WebSocket que nao conecta
- Recursos externos bloqueando

**Solucao 1: Adicionar timeout nas requisicoes**

Arquivo: Onde faz chamadas de API (ex: hooks/services)

```typescript
// ANTES (sem timeout)
const response = await fetch(`${API_URL}/api/games`);

// DEPOIS (com timeout)
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

try {
  const response = await fetch(`${API_URL}/api/games`, {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timeout');
    return { data: [], error: 'Timeout' };
  }
  throw error;
}
```

**Solucao 2: Tornar requisicoes opcionais na home**

```typescript
// Carregar dados de forma progressiva
const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nao bloquear renderizacao
    loadGames().catch(err => {
      console.error('Failed to load games:', err);
      setGames([]); // Continua com array vazio
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? <Skeleton /> : <GamesList games={games} />}
    </div>
  );
};
```

**Solucao 3: Desabilitar temporariamente WebSocket**

Arquivo: hooks/use-socket/index.tsx

```typescript
// Comentar conexao socket temporariamente para testar
// const socket = io(SOCKET_URL);

// Ou adicionar flag de ambiente
const socket = process.env.NEXT_PUBLIC_ENABLE_SOCKET === 'true'
  ? io(SOCKET_URL)
  : null;
```

---

### 2. ENDPOINT /api/platforms FALTANDO (404)

**Problema:** Frontend tenta acessar `/api/platforms` mas endpoint nao existe no backend.

**Localizacao Backend:** `c:\Users\Thiago\Desktop\marketplace\MercadoGamer-Backend-main\MercadoGamer-Backend-main\api\`

**Solucao: Criar endpoint de platforms**

Arquivo: `api/routes/platforms.js` (CRIAR NOVO)

```javascript
const express = require('express');
const router = express.Router();
const Platform = require('../models/Platform'); // Se existir

router.get('/', async (req, res) => {
  try {
    const { _filters, _page = 0, _perPage = 20, _populates = [], _sort = {} } = req.query;

    // Parse filters
    const filters = _filters ? JSON.parse(_filters) : {};

    // Temporario: retornar plataformas estaticas
    // TODO: Buscar do banco de dados quando modelo estiver criado
    const platforms = [
      { id: 1, name: 'PlayStation', enabled: true, slug: 'playstation' },
      { id: 2, name: 'Xbox', enabled: true, slug: 'xbox' },
      { id: 3, name: 'PC', enabled: true, slug: 'pc' },
      { id: 4, name: 'Nintendo Switch', enabled: true, slug: 'switch' },
      { id: 5, name: 'Mobile', enabled: true, slug: 'mobile' }
    ];

    // Aplicar filtros
    let filteredPlatforms = platforms;
    if (filters.enabled !== undefined) {
      filteredPlatforms = platforms.filter(p => p.enabled === filters.enabled);
    }

    res.json({
      data: filteredPlatforms,
      total: filteredPlatforms.length,
      page: parseInt(_page),
      perPage: parseInt(_perPage)
    });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

Arquivo: `api/app.js` (ADICIONAR)

```javascript
// Adicionar rota de platforms
const platformsRouter = require('./routes/platforms');
app.use('/api/platforms', platformsRouter);
```

---

### 3. VALIDAR PATHS DE IMAGENS (undefined.webp)

**Problema:** Codigo tenta carregar `http://localhost:3000/files/games/undefined.webp`

**Solucao: Adicionar validacao antes de renderizar imagens**

Arquivo: Componentes que exibem imagens de produtos

```typescript
// ANTES
<img src={`${API_URL}/files/games/${game.image}`} />

// DEPOIS
const getImageUrl = (game: Game) => {
  if (!game?.image) {
    return '/images/placeholder-game.png'; // Imagem padrao
  }
  return `${API_URL}/files/games/${game.image}`;
};

<img
  src={getImageUrl(game)}
  alt={game?.name || 'Game'}
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder-game.png';
  }}
/>
```

Criar componente reutilizavel:

```typescript
// components/SafeImage.tsx
interface SafeImageProps {
  src?: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallback = '/images/placeholder.png',
  className
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};
```

---

## PRIORIDADE 2 - ALTA (Resolver em 1-2 dias)

### 4. CORRIGIR PROPS INVALIDAS NO DOM

**Problema:** React esta enviando props customizadas (`textColor`, `bgColor`, etc) para elementos DOM nativos.

**Arquivos afetados:**
- `MercadoGamer\libs\ui-shared\src\widgets\button\index.tsx`
- `MercadoGamer\libs\ui-shared\src\widgets\icon-button\index.tsx`
- `MercadoGamer\libs\ui-shared\src\widgets\menu\index.tsx`

**Solucao: Usar prefixo $ para props transientes**

Arquivo: `libs/ui-shared/src/widgets/button/index.tsx`

```typescript
// ANTES
interface ButtonProps {
  textColor?: string;
  bgColor?: string;
  // ...
}

const StyledButton = styled.button<ButtonProps>`
  color: ${props => props.textColor || '#fff'};
  background-color: ${props => props.bgColor || '#007bff'};
`;

export const Button: React.FC<ButtonProps> = ({ textColor, bgColor, children, ...props }) => {
  return (
    <StyledButton textColor={textColor} bgColor={bgColor} {...props}>
      {children}
    </StyledButton>
  );
};

// DEPOIS (CORRETO)
interface ButtonProps {
  $textColor?: string;  // Prefixo $
  $bgColor?: string;    // Prefixo $
  children?: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  color: ${props => props.$textColor || '#fff'};
  background-color: ${props => props.$bgColor || '#007bff'};
`;

export const Button: React.FC<ButtonProps> = ({ $textColor, $bgColor, children, ...props }) => {
  return (
    <StyledButton $textColor={$textColor} $bgColor={$bgColor} {...props}>
      {children}
    </StyledButton>
  );
};
```

**Aplicar em todos os componentes:**

1. `IconButton` - props: `defaultColor`, `hoverColor`
2. `Menu` - props: `maxHeight`, `borderColor`, `styles`, `template`
3. `CustomToastContainer` - props: `gridTemplate`

**Script para encontrar todos os casos:**

```bash
cd MercadoGamer
grep -r "textColor\|bgColor\|maxHeight\|borderColor" --include="*.tsx" libs/
```

---

### 5. CORRIGIR REDUX SELECTORS

**Problema:** Selectors retornando estado completo causando re-renders desnecessarios.

**Solucao:**

```typescript
// ANTES (ERRADO)
export const selectSomething = (state: RootState) => state; // Retorna tudo!

// DEPOIS (CORRETO)
export const selectSomething = (state: RootState) => state.something.data;

// Melhor ainda: usar createSelector para memoizacao
import { createSelector } from '@reduxjs/toolkit';

export const selectSomethingData = (state: RootState) => state.something.data;

export const selectFilteredData = createSelector(
  [selectSomethingData],
  (data) => data.filter(item => item.enabled)
);
```

Encontrar selectors problematicos:

```bash
cd MercadoGamer
grep -r "=> state;" --include="*.ts" --include="*.tsx" src/
```

---

### 6. OTIMIZAR PERFORMANCE

**6.1 Implementar Loading States**

```typescript
// Adicionar skeleton loaders
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductCard = ({ product, loading }) => {
  if (loading) {
    return (
      <div>
        <Skeleton height={200} />
        <Skeleton count={2} />
      </div>
    );
  }

  return <div>{/* produto real */}</div>;
};
```

**6.2 Lazy Loading de Imagens**

```typescript
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={imageUrl}
  alt={alt}
  effect="blur"
  placeholderSrc="/images/placeholder.png"
/>
```

**6.3 Code Splitting**

```typescript
// ANTES
import HeavyComponent from './HeavyComponent';

// DEPOIS
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Se nao precisa SSR
});
```

---

## PRIORIDADE 3 - MEDIA (Resolver em 1 semana)

### 7. ADICIONAR ALT TEXT EM IMAGENS

**Problema:** 33 imagens sem atributo alt (acessibilidade)

**Solucao:**

```typescript
// ANTES
<img src={logoUrl} />

// DEPOIS
<img src={logoUrl} alt="MercadoGamer Logo" />

// Para imagens decorativas
<img src={decorativeImage} alt="" role="presentation" />

// Para imagens de produtos
<img
  src={product.image}
  alt={`${product.name} - ${product.category} para ${product.platform}`}
/>
```

Script para encontrar todas:

```bash
cd MercadoGamer
grep -r "<img" --include="*.tsx" src/ | grep -v "alt="
```

---

### 8. ADICIONAR TITULOS NAS PAGINAS

**Solucao com Next.js Head:**

```typescript
import Head from 'next/head';

const CatalogPage = () => {
  return (
    <>
      <Head>
        <title>Catalogo de Juegos - MercadoGamer</title>
        <meta
          name="description"
          content="Encuentra los mejores juegos, skins y codigos al mejor precio"
        />
      </Head>
      {/* conteudo */}
    </>
  );
};
```

Criar helper para SEO:

```typescript
// components/SEO.tsx
interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
  const fullTitle = `${title} | MercadoGamer`;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
};

// Uso:
<SEO
  title="Catalogo"
  description="Los mejores juegos al mejor precio"
/>
```

---

### 9. CRIAR PAGINA 404 CUSTOMIZADA

Arquivo: `pages/404.tsx` (CRIAR NOVO)

```typescript
import Link from 'next/link';
import { SEO } from '../components/SEO';

export default function Custom404() {
  return (
    <>
      <SEO title="Pagina no encontrada" />
      <div className="error-page">
        <h1>404</h1>
        <h2>Pagina no encontrada</h2>
        <p>La pagina que buscas no existe o fue movida.</p>

        <div className="suggestions">
          <h3>Te sugerimos:</h3>
          <ul>
            <li><Link href="/">Ir a la pagina principal</Link></li>
            <li><Link href="/catalogo">Ver el catalogo</Link></li>
            <li><Link href="/contact">Contactarnos</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
```

---

### 10. CRIAR ROTAS DE AUTENTICACAO

**Arquivo:** `pages/login.tsx` (CRIAR NOVO)

```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';
import { SEO } from '../components/SEO';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logica de login
  };

  return (
    <>
      <SEO title="Iniciar Sesion" />
      <div className="login-page">
        <h1>Iniciar Sesion</h1>
        <form onSubmit={handleLogin}>
          {/* formulario */}
        </form>
        <p>
          ¿No tienes cuenta? <Link href="/register">Registrate</Link>
        </p>
      </div>
    </>
  );
}
```

**Arquivo:** `pages/register.tsx` (CRIAR NOVO)

```typescript
export default function RegisterPage() {
  // Similar ao login
}
```

---

## CHECKLIST DE VERIFICACAO

Apos implementar as correcoes, verificar:

- [ ] Home page carrega em menos de 3 segundos
- [ ] Nao ha erros no console do browser (F12)
- [ ] Nao ha warnings de React props
- [ ] Endpoint /api/platforms retorna dados
- [ ] Todas as imagens tem atributo alt
- [ ] Todas as paginas tem titulo apropriado
- [ ] Pagina 404 customizada funciona
- [ ] Login e registro tem rotas dedicadas
- [ ] Imagens com paths invalidos nao quebram a pagina
- [ ] Performance geral melhorou (usar Lighthouse)

---

## COMANDOS UTEIS

```bash
# Rodar testes novamente
cd c:\Users\Thiago\Desktop\marketplace
node qa-test.js

# Verificar erros no console do Next.js
cd MercadoGamer
npm run dev

# Verificar backend
cd MercadoGamer-Backend-main/MercadoGamer-Backend-main/api
npm start

# Lighthouse para performance
npx lighthouse http://localhost:4200 --view

# Bundle analyzer para otimizacao
npm install -D @next/bundle-analyzer
```

---

## PROXIMOS PASSOS APOS CORRECOES

1. Rodar novamente os testes automatizados
2. Verificar que Score de Qualidade subiu de 48/100 para >80/100
3. Fazer code review das alteracoes
4. Testar manualmente todas as funcionalidades
5. Preparar para deploy em ambiente de staging
6. Testes de carga e stress
7. Security audit

---

**Nota:** Este documento deve ser atualizado conforme as correcoes sao implementadas.
