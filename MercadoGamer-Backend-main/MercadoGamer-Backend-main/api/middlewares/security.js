/**
 * Security Middleware
 *
 * Middleware de segurança para proteger a API
 * Inclui: Rate Limiting, Helmet, CORS configurável
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

/**
 * Rate Limiting
 * Previne ataques de força bruta e DDoS
 */
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: {
      success: false,
      message: 'Muitas requisições deste IP. Tente novamente mais tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Função para pular rate limiting em desenvolvimento
    skip: (req) => {
      return process.env.NODE_ENV === 'development' && req.ip === '::1';
    },
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Rate limiters específicos
 */
const rateLimiters = {
  // Geral - todas as rotas
  general: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // 100 requests
  }),

  // Auth - login/register (mais restritivo)
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 tentativas
    message: {
      success: false,
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    },
  }),

  // API - rotas de API (moderado)
  api: createRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 60, // 60 requests
  }),

  // Upload - uploads de arquivos (mais permissivo)
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 50, // 50 uploads
  }),
};

/**
 * Helmet - Headers de segurança
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
});

/**
 * CORS Configurável
 * Permite apenas origens autorizadas
 */
const corsConfig = () => {
  // Lista de origens permitidas
  const whitelist = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3001', // Frontend Web (dev)
        'http://localhost:4300', // Frontend Admin (dev)
        'https://mercadogamer.com', // Produção
        'https://admin.mercadogamer.com', // Admin produção
      ];

  return cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Permitir cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 horas
  });
};

/**
 * Sanitização de Input
 * Remove caracteres perigosos
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        // Remove tags HTML
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '');

        // Remove scripts
        req.body[key] = req.body[key].replace(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          ''
        );
      }
    });
  }
  next();
};

/**
 * Validação de Headers Obrigatórios
 */
const requireHeaders = (requiredHeaders = []) => {
  return (req, res, next) => {
    const missingHeaders = requiredHeaders.filter(
      (header) => !req.headers[header.toLowerCase()]
    );

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required headers: ${missingHeaders.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * IP Whitelist/Blacklist
 */
const ipFilter = () => {
  const blacklist = process.env.IP_BLACKLIST
    ? process.env.IP_BLACKLIST.split(',')
    : [];

  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;

    if (blacklist.includes(clientIp)) {
      console.warn(`⚠️  Blocked request from blacklisted IP: ${clientIp}`);
      return res.status(403).json({
        success: false,
        message: 'Access forbidden',
      });
    }

    next();
  };
};

/**
 * Logger de Requisições
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log quando a resposta terminar
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    // Log colorido baseado no status
    const statusColor =
      statusCode >= 500
        ? '\x1b[31m' // Vermelho
        : statusCode >= 400
        ? '\x1b[33m' // Amarelo
        : statusCode >= 300
        ? '\x1b[36m' // Ciano
        : '\x1b[32m'; // Verde

    console.log(
      `${statusColor}${method}\x1b[0m ${originalUrl} - ${statusColor}${statusCode}\x1b[0m - ${duration}ms - ${ip}`
    );
  });

  next();
};

/**
 * Detecção de Tentativas de SQL Injection
 */
const sqlInjectionDetection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(;|--|\|\||&&)/g,
    /('|('')|;|--|%|\/\*|\*\/)/g,
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some((pattern) => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((v) => checkValue(v));
    }
    return false;
  };

  const suspicious =
    (req.body && checkValue(req.body)) ||
    (req.query && checkValue(req.query)) ||
    (req.params && checkValue(req.params));

  if (suspicious) {
    console.warn(`⚠️  Potential SQL injection detected from IP: ${req.ip}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
    });
  }

  next();
};

/**
 * Exportar todos os middlewares
 */
module.exports = {
  rateLimiters,
  helmet: helmetConfig,
  cors: corsConfig,
  sanitizeInput,
  requireHeaders,
  ipFilter,
  requestLogger,
  sqlInjectionDetection,
};
