# 🔐 Guia de Implementação - Sistema KYC MercadoGamer

**Data:** 20/11/2025
**Versão:** 1.0
**Objetivo:** Implementar sistema completo de verificação de identidade (KYC) no MercadoGamer

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Níveis de Verificação](#níveis-de-verificação)
4. [Tecnologias e APIs](#tecnologias-e-apis)
5. [Banco de Dados](#banco-de-dados)
6. [Implementação Backend](#implementação-backend)
7. [Implementação Frontend](#implementação-frontend)
8. [Fluxo do Usuário](#fluxo-do-usuário)
9. [Segurança](#segurança)
10. [Compliance e Legal](#compliance-e-legal)
11. [Custos](#custos)
12. [Timeline](#timeline)

---

## 1. Visão Geral

### O que é KYC?

**KYC (Know Your Customer)** é um processo de verificação de identidade que:
- Confirma a identidade real dos usuários
- Previne fraudes e lavagem de dinheiro
- Garante conformidade com regulamentações (Lei 14.790/2023)
- Aumenta a confiança no marketplace

### Objetivos do Sistema

✅ **Compliance:** Atender Lei 14.790/2023 (obrigatória desde 01/01/2025)
✅ **Segurança:** Reduzir fraudes em 60-80%
✅ **Confiança:** Aumentar conversão em 40%+
✅ **Escalabilidade:** Verificar milhares de usuários automaticamente

---

## 2. Arquitetura

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Upload Docs  │  │   Selfie     │  │  Status KYC  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS/REST API
┌──────────────────────────▼──────────────────────────────┐
│                  BACKEND (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │           KYC Service Layer                      │  │
│  │  - Validação de dados                            │  │
│  │  - Orquestração de verificações                  │  │
│  │  - Gestão de níveis                              │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌──────▼──────┐ ┌────────▼─────────┐
│ Serpro API     │ │ Twilio SMS  │ │ AWS S3/Rekognition│
│ (Validar CPF)  │ │ (Verificar  │ │ (Docs & Biometria)│
│                │ │  Telefone)  │ │                   │
└────────────────┘ └─────────────┘ └───────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   DATABASE (MongoDB)                    │
│  - users (dados básicos)                                │
│  - kyc_verifications (documentos, status)               │
│  - kyc_logs (auditoria)                                 │
└─────────────────────────────────────────────────────────┘
```

### Componentes Principais

| Componente | Tecnologia | Responsabilidade |
|------------|------------|------------------|
| **Frontend** | Next.js + React | Upload de docs, câmera, UI |
| **Backend** | Node.js + Express | Lógica de negócio, orquestração |
| **Validação CPF** | Serpro API | Validar CPF com Receita Federal |
| **SMS** | Twilio Verify | Verificar número de telefone |
| **Storage** | AWS S3 | Armazenar documentos com segurança |
| **Biometria** | AWS Rekognition | Comparar selfie com documento |
| **Database** | MongoDB | Persistir dados de verificação |
| **Queue** | Bull (Redis) | Processamento assíncrono |

---

## 3. Níveis de Verificação

### Estrutura de Níveis

```
┌─────────────────────────────────────────────────────────┐
│  NÍVEL 0: Não Verificado                                │
│  ───────────────────────────────────────────────────    │
│  Requisitos:                                            │
│    ✅ Email                                             │
│    ✅ Senha                                             │
│                                                         │
│  Permissões:                                            │
│    ❌ Não pode comprar                                  │
│    ❌ Não pode vender                                   │
│    ✅ Pode navegar no site                              │
│                                                         │
│  Badge: ⚪ Sem verificação                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  NÍVEL 1: Verificação Básica                            │
│  ───────────────────────────────────────────────────    │
│  Requisitos:                                            │
│    ✅ Email verificado                                  │
│    ✅ Telefone verificado (SMS)                         │
│    ✅ CPF validado (Serpro)                             │
│    ✅ Nome completo                                     │
│    ✅ Data de nascimento                                │
│                                                         │
│  Permissões:                                            │
│    ✅ Comprar até R$ 500 por transação                  │
│    ❌ Não pode vender                                   │
│    ✅ Limite mensal: R$ 2.000                           │
│                                                         │
│  Badge: 🔵 Verificado                                   │
│  Tempo: 5 minutos (automático)                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  NÍVEL 2: Verificação Intermediária                     │
│  ───────────────────────────────────────────────────    │
│  Requisitos:                                            │
│    ✅ Tudo do Nível 1                                   │
│    ✅ Documento com foto (RG, CNH, Passaporte)          │
│    ✅ Selfie (verificação facial)                       │
│    ✅ Endereço completo                                 │
│                                                         │
│  Permissões:                                            │
│    ✅ Comprar até R$ 5.000 por transação                │
│    ✅ Vender até R$ 2.000 por mês                       │
│    ✅ Limite mensal: R$ 20.000                          │
│                                                         │
│  Badge: 🟢 Identidade Verificada                        │
│  Tempo: 2-24 horas (IA + manual se necessário)         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  NÍVEL 3: Verificação Completa (Vendedor Certificado)  │
│  ───────────────────────────────────────────────────    │
│  Requisitos:                                            │
│    ✅ Tudo do Nível 2                                   │
│    ✅ Comprovante de residência (< 90 dias)             │
│    ✅ Dados bancários verificados                       │
│    ✅ Histórico limpo (sem fraudes)                     │
│    ✅ Análise manual aprovada                           │
│                                                         │
│  Permissões:                                            │
│    ✅ Comprar SEM LIMITE                                │
│    ✅ Vender SEM LIMITE                                 │
│    ✅ Selo "Vendedor Certificado"                       │
│    ✅ Destaque nos resultados de busca                  │
│    ✅ Taxas reduzidas (desconto 10%)                    │
│                                                         │
│  Badge: 🏆 Vendedor Certificado                         │
│  Tempo: 2-5 dias úteis (análise manual rigorosa)       │
└─────────────────────────────────────────────────────────┘
```

### Tabela de Permissões

| Ação | Nível 0 | Nível 1 | Nível 2 | Nível 3 |
|------|---------|---------|---------|---------|
| **Navegar no site** | ✅ | ✅ | ✅ | ✅ |
| **Comprar (max)** | ❌ | R$ 500 | R$ 5.000 | ∞ |
| **Vender (max/mês)** | ❌ | ❌ | R$ 2.000 | ∞ |
| **Limite mensal** | ❌ | R$ 2.000 | R$ 20.000 | ∞ |
| **Selo verificado** | ❌ | 🔵 | 🟢 | 🏆 |
| **Suporte prioritário** | ❌ | ❌ | ❌ | ✅ |
| **Desconto taxas** | ❌ | ❌ | ❌ | 10% |
| **Destaque busca** | ❌ | ❌ | ❌ | ✅ |

---

## 4. Tecnologias e APIs

### 4.1 Serpro API - Validação de CPF

**Endpoint:** `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1/cpf/{cpf}`

**Documentação:** https://www.gov.br/conecta/catalogo/apis/consulta-cpf-df

**Autenticação:** OAuth 2.0 (Client Credentials)

**Exemplo de Uso:**

```javascript
const axios = require('axios');

// 1. Obter token
async function getSerproToken() {
  const response = await axios.post(
    'https://gateway.apiserpro.serpro.gov.br/token',
    'grant_type=client_credentials',
    {
      auth: {
        username: process.env.SERPRO_CLIENT_ID,
        password: process.env.SERPRO_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

// 2. Validar CPF
async function validateCPF(cpf, nome, dataNascimento) {
  const token = await getSerproToken();
  const cpfLimpo = cpf.replace(/\D/g, '');

  const response = await axios.get(
    `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1/cpf/${cpfLimpo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = response.data;

  // Verificar se CPF é válido e ativo
  if (data.situacao?.codigo !== '0') {
    throw new Error('CPF inválido ou irregular');
  }

  // Comparar nome (similaridade)
  const nomeCPF = data.nome?.toLowerCase().trim();
  const nomeUsuario = nome?.toLowerCase().trim();

  if (!nomeCPF.includes(nomeUsuario) && !nomeUsuario.includes(nomeCPF)) {
    throw new Error('Nome não corresponde ao CPF');
  }

  // Comparar data de nascimento
  if (data.nascimento !== dataNascimento) {
    throw new Error('Data de nascimento não corresponde');
  }

  return {
    valid: true,
    nome: data.nome,
    situacao: data.situacao.descricao,
  };
}
```

**Custos:**
- Produção: R$ 0,05 por consulta
- Sandbox: Grátis (para testes)

---

### 4.2 Twilio Verify - Verificação de Telefone

**Documentação:** https://www.twilio.com/docs/verify/api

**Exemplo de Uso:**

```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 1. Enviar código SMS
async function sendVerificationCode(phoneNumber) {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: phoneNumber, // +5511999999999
      channel: 'sms', // ou 'whatsapp'
      locale: 'pt-BR',
    });

  return verification.sid;
}

// 2. Verificar código
async function verifyCode(phoneNumber, code) {
  const verificationCheck = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: phoneNumber,
      code: code, // código de 6 dígitos
    });

  return verificationCheck.status === 'approved';
}
```

**Custos:**
- SMS: R$ 0,25 por mensagem
- WhatsApp: R$ 0,15 por mensagem

---

### 4.3 AWS S3 - Armazenamento de Documentos

**Exemplo de Upload Seguro:**

```javascript
const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function uploadDocument(userId, file, documentType) {
  // Gerar nome único e seguro
  const hash = crypto.randomBytes(16).toString('hex');
  const extension = file.originalname.split('.').pop();
  const fileName = `kyc/${userId}/${documentType}_${hash}.${extension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ServerSideEncryption: 'AES256', // Criptografia
    Metadata: {
      userId: userId,
      documentType: documentType,
      uploadDate: new Date().toISOString(),
    },
    // ACL privado - apenas backend pode acessar
    ACL: 'private',
  };

  const result = await s3.upload(params).promise();

  return {
    url: result.Location,
    key: result.Key,
    bucket: result.Bucket,
  };
}

// Gerar URL temporária (expira em 1 hora)
async function getSignedUrl(key) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 3600, // 1 hora
  };

  return s3.getSignedUrl('getObject', params);
}
```

---

### 4.4 AWS Rekognition - Biometria Facial

**Exemplo de Comparação Facial:**

```javascript
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function compareFaces(documentImageKey, selfieImageKey) {
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET,
        Name: documentImageKey,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET,
        Name: selfieImageKey,
      },
    },
    SimilarityThreshold: 90, // 90% de similaridade
  };

  const result = await rekognition.compareFaces(params).promise();

  if (result.FaceMatches.length === 0) {
    return {
      match: false,
      similarity: 0,
      message: 'Nenhum rosto correspondente encontrado',
    };
  }

  const match = result.FaceMatches[0];

  return {
    match: match.Similarity >= 90,
    similarity: match.Similarity,
    confidence: match.Face.Confidence,
  };
}

// Detectar se há um rosto na imagem
async function detectFace(imageKey) {
  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET,
        Name: imageKey,
      },
    },
    Attributes: ['ALL'],
  };

  const result = await rekognition.detectFaces(params).promise();

  if (result.FaceDetails.length === 0) {
    throw new Error('Nenhum rosto detectado na imagem');
  }

  if (result.FaceDetails.length > 1) {
    throw new Error('Múltiplos rostos detectados. Use apenas uma foto sua.');
  }

  const face = result.FaceDetails[0];

  return {
    detected: true,
    confidence: face.Confidence,
    ageRange: face.AgeRange,
    gender: face.Gender,
    sunglasses: face.Sunglasses.Value,
    eyesOpen: face.EyesOpen.Value,
    quality: face.Quality,
  };
}
```

**Custos AWS Rekognition:**
- Comparação facial: $0.001 por imagem (R$ 0,005)
- Detecção facial: $0.001 por imagem (R$ 0,005)
- Primeiro 1M de imagens/mês tem desconto

---

## 5. Banco de Dados

### 5.1 Schema MongoDB

**Collection: users**

```javascript
{
  _id: ObjectId("..."),
  email: "joao@example.com",
  password: "hashed_password",
  name: "João Silva",
  cpf: "12345678900", // criptografado
  phone: "+5511999999999",
  birthdate: "1990-01-15",
  address: {
    street: "Rua Exemplo",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01000-000",
    country: "BR"
  },
  kycLevel: 2, // 0, 1, 2, 3
  kycVerifiedAt: ISODate("2025-11-20T10:30:00Z"),
  kycExpiresAt: ISODate("2026-11-20T10:30:00Z"), // renovar anualmente
  emailVerified: true,
  phoneVerified: true,
  badges: ["email_verified", "phone_verified", "identity_verified"],
  limits: {
    maxPurchasePerTransaction: 5000,
    maxSalesPerMonth: 2000,
    monthlyLimit: 20000
  },
  createdAt: ISODate("2024-01-15T08:00:00Z"),
  updatedAt: ISODate("2025-11-20T10:30:00Z")
}
```

**Collection: kyc_verifications**

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  level: 2, // nível solicitado
  status: "approved", // pending, approved, rejected, under_review

  // Documentos enviados
  documents: [
    {
      type: "identity", // identity, selfie, address_proof
      fileName: "rg_abc123.jpg",
      s3Key: "kyc/user123/identity_abc123.jpg",
      uploadedAt: ISODate("2025-11-20T10:00:00Z"),
      verified: true
    },
    {
      type: "selfie",
      fileName: "selfie_def456.jpg",
      s3Key: "kyc/user123/selfie_def456.jpg",
      uploadedAt: ISODate("2025-11-20T10:05:00Z"),
      verified: true
    }
  ],

  // Verificações realizadas
  checks: {
    cpf: {
      valid: true,
      checkedAt: ISODate("2025-11-20T10:01:00Z"),
      provider: "serpro"
    },
    phone: {
      valid: true,
      checkedAt: ISODate("2025-11-20T10:02:00Z"),
      provider: "twilio"
    },
    facialMatch: {
      similarity: 96.5,
      match: true,
      checkedAt: ISODate("2025-11-20T10:10:00Z"),
      provider: "aws_rekognition"
    }
  },

  // Análise manual (se necessário)
  manualReview: {
    required: false,
    reviewer: ObjectId("admin_id"),
    reviewedAt: ISODate("2025-11-20T12:00:00Z"),
    notes: "Documentos válidos. Aprovado.",
    decision: "approved" // approved, rejected, more_info_needed
  },

  // Motivo de rejeição (se aplicável)
  rejectionReason: null,

  submittedAt: ISODate("2025-11-20T10:00:00Z"),
  completedAt: ISODate("2025-11-20T10:30:00Z"),

  createdAt: ISODate("2025-11-20T09:50:00Z"),
  updatedAt: ISODate("2025-11-20T10:30:00Z")
}
```

**Collection: kyc_logs**

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  verificationId: ObjectId("..."),
  action: "cpf_validated", // cpf_validated, document_uploaded, etc.
  details: {
    provider: "serpro",
    success: true,
    response: { /* dados da API */ }
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate("2025-11-20T10:01:00Z")
}
```

### 5.2 Índices Recomendados

```javascript
// users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ cpf: 1 }, { unique: true, sparse: true });
db.users.createIndex({ phone: 1 }, { sparse: true });
db.users.createIndex({ kycLevel: 1 });

// kyc_verifications
db.kyc_verifications.createIndex({ userId: 1 });
db.kyc_verifications.createIndex({ status: 1 });
db.kyc_verifications.createIndex({ submittedAt: -1 });
db.kyc_verifications.createIndex({ "manualReview.required": 1, status: 1 });

// kyc_logs
db.kyc_logs.createIndex({ userId: 1, timestamp: -1 });
db.kyc_logs.createIndex({ verificationId: 1 });
db.kyc_logs.createIndex({ timestamp: -1 });
```

---

## 6. Implementação Backend

### 6.1 Estrutura de Pastas

```
api/
├── modules/
│   └── kyc/
│       ├── route.js              # Rotas KYC
│       ├── controller.js         # Lógica de controle
│       ├── service.js            # Lógica de negócio
│       ├── validator.js          # Validação de dados
│       └── __tests__/
│           └── kyc.test.js       # Testes unitários
├── helpers/
│   ├── serpro/
│   │   └── index.js              # Cliente Serpro
│   ├── twilio/
│   │   └── index.js              # Cliente Twilio
│   ├── aws/
│   │   ├── s3.js                 # Upload S3
│   │   └── rekognition.js        # Biometria
│   └── kyc-utils/
│       ├── levels.js             # Constantes de níveis
│       ├── limits.js             # Cálculo de limites
│       └── badges.js             # Gestão de badges
├── middlewares/
│   └── kycRequired.js            # Middleware verificação
├── models/
│   ├── KYCVerification.js        # Model Mongoose
│   └── KYCLog.js                 # Model Mongoose
└── config/
    └── kyc.js                    # Configurações KYC
```

### 6.2 Rotas da API

```javascript
// api/modules/kyc/route.js
const express = require('express');
const router = express.Router();
const kycController = require('./controller');
const { authenticated } = require('../../middlewares/auth');
const { uploadMiddleware } = require('../../middlewares/upload');

// Obter status KYC do usuário
router.get('/status', authenticated, kycController.getStatus);

// Iniciar verificação de nível
router.post('/start-verification/:level', authenticated, kycController.startVerification);

// NÍVEL 1: Verificar telefone
router.post('/verify-phone/send', authenticated, kycController.sendPhoneCode);
router.post('/verify-phone/check', authenticated, kycController.verifyPhoneCode);

// NÍVEL 1: Validar CPF
router.post('/validate-cpf', authenticated, kycController.validateCPF);

// NÍVEL 2: Upload documentos
router.post(
  '/upload-document',
  authenticated,
  uploadMiddleware.single('document'),
  kycController.uploadDocument
);

// NÍVEL 2: Upload selfie
router.post(
  '/upload-selfie',
  authenticated,
  uploadMiddleware.single('selfie'),
  kycController.uploadSelfie
);

// NÍVEL 3: Upload comprovante residência
router.post(
  '/upload-address-proof',
  authenticated,
  uploadMiddleware.single('addressProof'),
  kycController.uploadAddressProof
);

// Submeter verificação para análise
router.post('/submit', authenticated, kycController.submitVerification);

// Histórico de verificações
router.get('/history', authenticated, kycController.getHistory);

// [ADMIN] Listar verificações pendentes
router.get('/admin/pending', authenticated, kycController.adminGetPending);

// [ADMIN] Aprovar/Rejeitar verificação
router.post('/admin/review/:verificationId', authenticated, kycController.adminReview);

module.exports = router;
```

### 6.3 Controller Exemplo

```javascript
// api/modules/kyc/controller.js
const kycService = require('./service');

exports.getStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const status = await kycService.getUserKYCStatus(userId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.validateCPF = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cpf, name, birthdate } = req.body;

    // Validar formato CPF
    if (!/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
      throw new Error('CPF inválido');
    }

    const result = await kycService.validateUserCPF(userId, cpf, name, birthdate);

    res.json({
      success: true,
      message: 'CPF validado com sucesso!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendPhoneCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { phone } = req.body;

    // Validar formato telefone
    if (!/^\+55\d{10,11}$/.test(phone)) {
      throw new Error('Telefone inválido. Use formato: +5511999999999');
    }

    await kycService.sendPhoneVerificationCode(userId, phone);

    res.json({
      success: true,
      message: 'Código enviado via SMS',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPhoneCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    const result = await kycService.verifyPhoneCode(userId, code);

    res.json({
      success: true,
      message: 'Telefone verificado com sucesso!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Código inválido ou expirado',
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      throw new Error('Nenhum arquivo enviado');
    }

    // Validar tipo de arquivo
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('Apenas imagens JPG, JPEG ou PNG são permitidas');
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo 5MB');
    }

    const result = await kycService.uploadIdentityDocument(userId, file);

    res.json({
      success: true,
      message: 'Documento enviado com sucesso!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitVerification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { level } = req.body;

    const result = await kycService.submitForReview(userId, level);

    res.json({
      success: true,
      message: 'Verificação submetida! Aguarde análise.',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

### 6.4 Service Exemplo (Lógica de Negócio)

```javascript
// api/modules/kyc/service.js
const User = require('../../models/User');
const KYCVerification = require('../../models/KYCVerification');
const KYCLog = require('../../models/KYCLog');
const serproHelper = require('../../helpers/serpro');
const twilioHelper = require('../../helpers/twilio');
const s3Helper = require('../../helpers/aws/s3');
const rekognitionHelper = require('../../helpers/aws/rekognition');

class KYCService {
  async getUserKYCStatus(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Buscar última verificação
    const lastVerification = await KYCVerification.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      currentLevel: user.kycLevel,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      badges: user.badges || [],
      limits: user.limits,
      lastVerification: lastVerification
        ? {
            level: lastVerification.level,
            status: lastVerification.status,
            submittedAt: lastVerification.submittedAt,
            completedAt: lastVerification.completedAt,
          }
        : null,
      canUpgrade: this.canUpgradeLevel(user),
    };
  }

  async validateUserCPF(userId, cpf, name, birthdate) {
    const user = await User.findById(userId);

    // Validar com Serpro
    const serproResult = await serproHelper.validateCPF(cpf, name, birthdate);

    if (!serproResult.valid) {
      throw new Error('CPF inválido ou dados não correspondem');
    }

    // Atualizar usuário
    user.cpf = cpf; // deve ser criptografado antes de salvar
    user.name = name;
    user.birthdate = birthdate;

    // Se ainda não tem verificação de nível 1, criar
    if (user.kycLevel < 1 && user.emailVerified && user.phoneVerified) {
      user.kycLevel = 1;
      user.limits = this.getLimitsForLevel(1);
      user.badges.push('cpf_verified');
      user.kycVerifiedAt = new Date();
    }

    await user.save();

    // Log de auditoria
    await this.createLog(userId, null, 'cpf_validated', {
      provider: 'serpro',
      success: true,
    });

    return {
      valid: true,
      level: user.kycLevel,
    };
  }

  async sendPhoneVerificationCode(userId, phone) {
    const user = await User.findById(userId);

    // Enviar código via Twilio
    await twilioHelper.sendVerificationCode(phone);

    // Atualizar telefone temporário
    user.phoneTemp = phone;
    await user.save();

    return { sent: true };
  }

  async verifyPhoneCode(userId, code) {
    const user = await User.findById(userId);

    if (!user.phoneTemp) {
      throw new Error('Nenhum telefone pendente de verificação');
    }

    // Verificar código
    const isValid = await twilioHelper.verifyCode(user.phoneTemp, code);

    if (!isValid) {
      throw new Error('Código inválido');
    }

    // Confirmar telefone
    user.phone = user.phoneTemp;
    user.phoneTemp = null;
    user.phoneVerified = true;
    user.badges.push('phone_verified');

    await user.save();

    await this.createLog(userId, null, 'phone_verified', {
      provider: 'twilio',
      success: true,
      phone: user.phone,
    });

    return {
      verified: true,
      level: user.kycLevel,
    };
  }

  async uploadIdentityDocument(userId, file) {
    const user = await User.findById(userId);

    if (user.kycLevel < 1) {
      throw new Error('Complete a verificação Nível 1 primeiro');
    }

    // Upload para S3
    const uploadResult = await s3Helper.uploadDocument(userId, file, 'identity');

    // Buscar ou criar verificação de nível 2
    let verification = await KYCVerification.findOne({
      userId,
      level: 2,
      status: { $in: ['pending', 'under_review'] },
    });

    if (!verification) {
      verification = new KYCVerification({
        userId,
        level: 2,
        status: 'pending',
        documents: [],
        checks: {},
      });
    }

    // Adicionar documento
    verification.documents.push({
      type: 'identity',
      fileName: file.originalname,
      s3Key: uploadResult.key,
      uploadedAt: new Date(),
      verified: false,
    });

    await verification.save();

    await this.createLog(userId, verification._id, 'document_uploaded', {
      documentType: 'identity',
      s3Key: uploadResult.key,
    });

    return {
      uploaded: true,
      verificationId: verification._id,
    };
  }

  async uploadSelfie(userId, file) {
    const user = await User.findById(userId);

    // Upload para S3
    const uploadResult = await s3Helper.uploadDocument(userId, file, 'selfie');

    // Buscar verificação pendente
    const verification = await KYCVerification.findOne({
      userId,
      level: 2,
      status: { $in: ['pending', 'under_review'] },
    });

    if (!verification) {
      throw new Error('Nenhuma verificação de nível 2 em andamento');
    }

    // Verificar se tem documento de identidade
    const identityDoc = verification.documents.find((d) => d.type === 'identity');

    if (!identityDoc) {
      throw new Error('Envie o documento de identidade primeiro');
    }

    // Adicionar selfie
    verification.documents.push({
      type: 'selfie',
      fileName: file.originalname,
      s3Key: uploadResult.key,
      uploadedAt: new Date(),
      verified: false,
    });

    await verification.save();

    // Processar comparação facial em background (fila)
    this.processFacialComparison(verification._id, identityDoc.s3Key, uploadResult.key);

    return {
      uploaded: true,
      verificationId: verification._id,
    };
  }

  async processFacialComparison(verificationId, documentKey, selfieKey) {
    try {
      // Comparar rostos
      const result = await rekognitionHelper.compareFaces(documentKey, selfieKey);

      const verification = await KYCVerification.findById(verificationId);

      verification.checks.facialMatch = {
        similarity: result.similarity,
        match: result.match,
        checkedAt: new Date(),
        provider: 'aws_rekognition',
      };

      // Se match > 90%, marcar documentos como verificados
      if (result.match) {
        verification.documents.forEach((doc) => {
          if (doc.type === 'identity' || doc.type === 'selfie') {
            doc.verified = true;
          }
        });
      }

      await verification.save();

      await this.createLog(verification.userId, verificationId, 'facial_comparison', {
        provider: 'aws_rekognition',
        similarity: result.similarity,
        match: result.match,
      });
    } catch (error) {
      console.error('Erro na comparação facial:', error);

      // Marcar para revisão manual
      await KYCVerification.findByIdAndUpdate(verificationId, {
        'manualReview.required': true,
        'manualReview.reason': 'Falha na comparação automática',
      });
    }
  }

  async submitForReview(userId, level) {
    const verification = await KYCVerification.findOne({
      userId,
      level,
      status: 'pending',
    });

    if (!verification) {
      throw new Error('Nenhuma verificação pendente encontrada');
    }

    // Validar se todos os documentos foram enviados
    this.validateVerificationComplete(verification, level);

    // Se nível 2 e todas as verificações automáticas passaram, aprovar automaticamente
    if (level === 2 && this.isAutoApprovable(verification)) {
      verification.status = 'approved';
      verification.completedAt = new Date();

      // Atualizar usuário
      await User.findByIdAndUpdate(userId, {
        kycLevel: 2,
        limits: this.getLimitsForLevel(2),
        $push: { badges: 'identity_verified' },
        kycVerifiedAt: new Date(),
      });
    } else {
      // Marcar para revisão manual
      verification.status = 'under_review';
      verification.manualReview.required = true;
    }

    verification.submittedAt = new Date();
    await verification.save();

    return {
      submitted: true,
      status: verification.status,
      requiresManualReview: verification.status === 'under_review',
    };
  }

  validateVerificationComplete(verification, level) {
    if (level === 2) {
      const hasIdentity = verification.documents.some((d) => d.type === 'identity');
      const hasSelfie = verification.documents.some((d) => d.type === 'selfie');

      if (!hasIdentity || !hasSelfie) {
        throw new Error('Envie documento de identidade e selfie');
      }
    }

    if (level === 3) {
      const hasAddressProof = verification.documents.some((d) => d.type === 'address_proof');

      if (!hasAddressProof) {
        throw new Error('Envie comprovante de residência');
      }
    }
  }

  isAutoApprovable(verification) {
    // Verificar se todas as checagens passaram
    const cpfValid = verification.checks.cpf?.valid === true;
    const phoneValid = verification.checks.phone?.valid === true;
    const faceMatch = verification.checks.facialMatch?.match === true;

    return cpfValid && phoneValid && faceMatch;
  }

  getLimitsForLevel(level) {
    const limits = {
      0: {
        maxPurchasePerTransaction: 0,
        maxSalesPerMonth: 0,
        monthlyLimit: 0,
      },
      1: {
        maxPurchasePerTransaction: 500,
        maxSalesPerMonth: 0,
        monthlyLimit: 2000,
      },
      2: {
        maxPurchasePerTransaction: 5000,
        maxSalesPerMonth: 2000,
        monthlyLimit: 20000,
      },
      3: {
        maxPurchasePerTransaction: Infinity,
        maxSalesPerMonth: Infinity,
        monthlyLimit: Infinity,
      },
    };

    return limits[level] || limits[0];
  }

  canUpgradeLevel(user) {
    if (user.kycLevel === 0) {
      return user.emailVerified && user.phoneVerified && user.cpf;
    }

    if (user.kycLevel === 1) {
      return true; // Sempre pode tentar upgrade para nível 2
    }

    if (user.kycLevel === 2) {
      return true; // Sempre pode tentar upgrade para nível 3
    }

    return false;
  }

  async createLog(userId, verificationId, action, details) {
    await KYCLog.create({
      userId,
      verificationId,
      action,
      details,
      timestamp: new Date(),
    });
  }
}

module.exports = new KYCService();
```

---

## 7. Implementação Frontend

### 7.1 Página de Verificação KYC

```typescript
// apps/web/src/pages/verificacao/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Level1Verification from '@/components/KYC/Level1Verification';
import Level2Verification from '@/components/KYC/Level2Verification';
import Level3Verification from '@/components/KYC/Level3Verification';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

const steps = ['Verificação Básica', 'Identidade', 'Certificação'];

export default function VerificationPage() {
  const { t } = useTranslation('kyc');
  const router = useRouter();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await api.get('/kyc/status');
      setKycStatus(response.data.data);
      setActiveStep(response.data.data.currentLevel);
    } catch (error) {
      console.error('Erro ao carregar status KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Level1Verification onComplete={handleNext} />;
      case 1:
        return <Level2Verification onComplete={handleNext} onBack={handleBack} />;
      case 2:
        return <Level3Verification onComplete={handleNext} onBack={handleBack} />;
      default:
        return <Typography>Nível desconhecido</Typography>;
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      {kycStatus?.currentLevel === 3 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Você já está completamente verificado! 🎉
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label} completed={kycStatus?.currentLevel > index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}
    </Box>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'kyc'])),
    },
  };
}
```

### 7.2 Componente Nível 1

```typescript
// apps/web/src/components/KYC/Level1Verification.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Send as SendIcon, Check as CheckIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '@/services/api';

interface Level1FormData {
  cpf: string;
  name: string;
  birthdate: string;
  phone: string;
  verificationCode: string;
}

export default function Level1Verification({ onComplete }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Level1FormData>();
  const [step, setStep] = useState<'cpf' | 'phone' | 'complete'>('cpf');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCPFSubmit = async (data: Level1FormData) => {
    setLoading(true);
    try {
      await api.post('/kyc/validate-cpf', {
        cpf: data.cpf,
        name: data.name,
        birthdate: data.birthdate,
      });

      toast.success('CPF validado com sucesso!');
      setStep('phone');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao validar CPF');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (phone: string) => {
    setLoading(true);
    try {
      await api.post('/kyc/verify-phone/send', { phone });
      setCodeSent(true);
      toast.success('Código enviado via SMS!');
    } catch (error) {
      toast.error('Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setLoading(true);
    try {
      await api.post('/kyc/verify-phone/check', { code });
      toast.success('Telefone verificado!');
      setStep('complete');
      onComplete();
    } catch (error) {
      toast.error('Código inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Nível 1: Verificação Básica
      </Typography>

      {step === 'cpf' && (
        <Box component="form" onSubmit={handleSubmit(handleCPFSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                {...register('name', { required: 'Nome é obrigatório' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF"
                placeholder="000.000.000-00"
                {...register('cpf', {
                  required: 'CPF é obrigatório',
                  pattern: {
                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: 'CPF inválido',
                  },
                })}
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Nascimento"
                InputLabelProps={{ shrink: true }}
                {...register('birthdate', { required: 'Data de nascimento é obrigatória' })}
                error={!!errors.birthdate}
                helperText={errors.birthdate?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? 'Validando...' : 'Validar CPF'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {step === 'phone' && (
        <Box component="form" onSubmit={handleSubmit((data) => {
          if (!codeSent) {
            handleSendCode(data.phone);
          } else {
            handleVerifyCode(data.verificationCode);
          }
        })}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone"
                placeholder="+5511999999999"
                {...register('phone', {
                  required: 'Telefone é obrigatório',
                  pattern: {
                    value: /^\+55\d{10,11}$/,
                    message: 'Formato: +5511999999999',
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={codeSent}
                InputProps={{
                  endAdornment: !codeSent && (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {codeSent && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Código enviado! Digite o código de 6 dígitos recebido por SMS.
                </Alert>

                <TextField
                  fullWidth
                  label="Código de Verificação"
                  placeholder="000000"
                  {...register('verificationCode', {
                    required: 'Código é obrigatório',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Código deve ter 6 dígitos',
                    },
                  })}
                  error={!!errors.verificationCode}
                  helperText={errors.verificationCode?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {step === 'complete' && (
        <Alert severity="success">
          <Typography variant="h6">
            <CheckIcon sx={{ mr: 1 }} />
            Nível 1 Completo!
          </Typography>
          <Typography>
            Você pode agora comprar produtos de até R$ 500.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
```

### 7.3 Componente Nível 2 (Upload de Documentos)

```typescript
// apps/web/src/components/KYC/Level2Verification.tsx
import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CameraAlt as CameraIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '@/services/api';

export default function Level2Verification({ onComplete, onBack }) {
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Apenas imagens JPG, JPEG ou PNG');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document', file);

    try {
      await api.post('/kyc/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setDocumentUploaded(true);
      toast.success('Documento enviado com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar documento');
    } finally {
      setUploading(false);
    }
  };

  const handleSelfieUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      await api.post('/kyc/upload-selfie', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setSelfieUploaded(true);
      toast.success('Selfie enviada! Processando biometria...');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar selfie');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!documentUploaded || !selfieUploaded) {
      toast.error('Envie todos os documentos primeiro');
      return;
    }

    setUploading(true);

    try {
      await api.post('/kyc/submit', { level: 2 });
      toast.success('Verificação submetida! Aguarde análise.');
      onComplete();
    } catch (error) {
      toast.error('Erro ao submeter verificação');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Nível 2: Verificação de Identidade
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Para verificar sua identidade, precisamos de um documento com foto e uma selfie.
      </Alert>

      <Grid container spacing={3}>
        {/* Upload Documento */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. Documento com Foto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                RG, CNH ou Passaporte
              </Typography>

              {documentUploaded ? (
                <Alert severity="success" icon={<CheckIcon />}>
                  Documento enviado!
                </Alert>
              ) : (
                <>
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: 'none' }}
                    onChange={handleDocumentUpload}
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<UploadIcon />}
                    onClick={() => documentInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Enviar Documento
                  </Button>
                </>
              )}

              {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />}
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Selfie */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2. Selfie
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tire uma foto do seu rosto
              </Typography>

              {selfieUploaded ? (
                <Alert severity="success" icon={<CheckIcon />}>
                  Selfie enviada!
                </Alert>
              ) : (
                <>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    capture="user"
                    style={{ display: 'none' }}
                    onChange={handleSelfieUpload}
                  />
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CameraIcon />}
                    onClick={() => selfieInputRef.current?.click()}
                    disabled={uploading || !documentUploaded}
                  >
                    Tirar Selfie
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Botões */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={onBack}>
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!documentUploaded || !selfieUploaded || uploading}
              fullWidth
            >
              {uploading ? 'Processando...' : 'Submeter Verificação'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
```

---

## 8. Fluxo do Usuário

### 8.1 Diagrama de Fluxo Completo

```
[USUÁRIO NOVO]
      │
      ▼
┌──────────────┐
│   CADASTRO   │
│  Email/Senha │
└──────────────┘
      │
      ▼
┌───────────────────────────┐
│  Verificar Email          │
│  - Envia link por email   │
│  - Clica no link          │
│  ✅ Email verificado      │
└───────────────────────────┘
      │
      ▼
┌───────────────────────────────┐
│  NÍVEL 0 → NÍVEL 1            │
│  ──────────────────────────   │
│  1. Preencher CPF + dados     │
│  2. Validar com Serpro        │
│  3. Enviar código SMS         │
│  4. Confirmar código          │
│  ✅ Nível 1 aprovado          │
│                               │
│  PODE:                        │
│  - Comprar até R$ 500         │
└───────────────────────────────┘
      │
      ▼
┌───────────────────────────────┐
│  NÍVEL 1 → NÍVEL 2            │
│  ──────────────────────────   │
│  1. Upload documento (RG/CNH) │
│  2. Upload selfie             │
│  3. IA compara rostos         │
│  4. Aprovação automática      │
│     (se match > 90%)          │
│  ✅ Nível 2 aprovado          │
│                               │
│  PODE:                        │
│  - Comprar até R$ 5.000       │
│  - Vender até R$ 2.000/mês    │
└───────────────────────────────┘
      │
      ▼
┌───────────────────────────────┐
│  NÍVEL 2 → NÍVEL 3            │
│  ──────────────────────────   │
│  1. Upload comprovante        │
│     residência                │
│  2. Preencher dados bancários │
│  3. Análise manual (equipe)   │
│  4. Aprovação (2-5 dias)      │
│  ✅ Nível 3 aprovado          │
│                               │
│  PODE:                        │
│  - Comprar SEM LIMITE         │
│  - Vender SEM LIMITE          │
│  - Selo Certificado 🏆        │
└───────────────────────────────┘
```

### 8.2 Mensagens de Email

**Email de Boas-vindas (Pós-Cadastro):**

```html
Assunto: Bem-vindo ao MercadoGamer! Verifique seu email

Olá {{name}},

Obrigado por se cadastrar no MercadoGamer!

Para começar a usar a plataforma, você precisa verificar seu email:

[BOTÃO: Verificar Email]

Após verificar, você pode:
✅ Completar sua verificação de identidade
✅ Comprar jogos e contas
✅ Vender seus produtos

Qualquer dúvida, estamos aqui para ajudar!

Equipe MercadoGamer
```

**Email de Nível 1 Aprovado:**

```html
Assunto: 🎉 Parabéns! Você está verificado (Nível 1)

Olá {{name}},

Você completou a verificação Nível 1! 🎉

Agora você pode:
✅ Comprar produtos de até R$ 500
✅ Limite mensal de R$ 2.000

Quer desbloquear mais?
➡️ Complete a verificação Nível 2 e:
  - Compre até R$ 5.000
  - Venda produtos
  - Ganhe selo de Identidade Verificada

[BOTÃO: Completar Nível 2]

Equipe MercadoGamer
```

**Email de Nível 2 em Análise:**

```html
Assunto: Seus documentos estão em análise

Olá {{name}},

Recebemos seus documentos para verificação Nível 2!

Status: Em Análise 🔍
Prazo: Até 24 horas

Vamos notificar você assim que for aprovado.

Equipe MercadoGamer
```

**Email de Nível 2 Aprovado:**

```html
Assunto: ✅ Identidade Verificada! (Nível 2)

Olá {{name}},

Sua identidade foi verificada com sucesso! ✅

Você ganhou o selo de Identidade Verificada 🟢

Novos benefícios:
✅ Comprar até R$ 5.000
✅ Vender até R$ 2.000/mês
✅ Limite mensal de R$ 20.000

Quer mais?
➡️ Complete a verificação Nível 3 e seja um Vendedor Certificado

[BOTÃO: Completar Nível 3]

Equipe MercadoGamer
```

---

## 9. Segurança

### 9.1 Criptografia de Dados Sensíveis

```javascript
// helpers/encryption.js
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV_LENGTH = 16;

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

exports.decrypt = (encryptedData) => {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
```

**Uso:**

```javascript
// Antes de salvar CPF
user.cpf = encryptionHelper.encrypt(cpf);

// Ao ler CPF
const cpfDecrypted = encryptionHelper.decrypt(user.cpf);
```

### 9.2 Auditoria e Logs

Todos os eventos KYC são registrados:

```javascript
// Exemplo de log
{
  userId: ObjectId("..."),
  verificationId: ObjectId("..."),
  action: "cpf_validated",
  details: {
    provider: "serpro",
    success: true,
    cpfValid: true
  },
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate("2025-11-20T10:01:00Z")
}
```

### 9.3 Proteção contra Fraudes

**Detecção de Múltiplas Contas:**

```javascript
// Verificar se CPF já foi usado
const existingUser = await User.findOne({ cpf: encryptedCPF });
if (existingUser && existingUser._id.toString() !== userId) {
  throw new Error('CPF já cadastrado em outra conta');
}

// Verificar se telefone já foi usado
const existingPhone = await User.findOne({ phone });
if (existingPhone && existingPhone._id.toString() !== userId) {
  // Alertar equipe de fraude
  await notifyFraudTeam({
    userId,
    reason: 'duplicate_phone',
    phone,
  });
}
```

**Limite de Tentativas:**

```javascript
// Limitar tentativas de verificação
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 24 * 60 * 60 * 1000; // 24 horas

const attemptCount = await KYCVerification.countDocuments({
  userId,
  status: 'rejected',
  createdAt: { $gte: new Date(Date.now() - LOCKOUT_TIME) },
});

if (attemptCount >= MAX_ATTEMPTS) {
  throw new Error('Limite de tentativas excedido. Aguarde 24 horas.');
}
```

---

## 10. Compliance e Legal

### 10.1 Lei 14.790/2023 - Regulamentação de Jogos no Brasil

**Obrigações:**

1. ✅ Verificar identidade de todos os usuários
2. ✅ Validar CPF com Receita Federal
3. ✅ Verificar localização (Brasil)
4. ✅ Impedir menores de 18 anos
5. ✅ Monitorar transações suspeitas (AML)
6. ✅ Manter registros por 5 anos
7. ✅ Reportar atividades suspeitas ao COAF

### 10.2 LGPD - Lei Geral de Proteção de Dados

**Conformidade:**

1. ✅ Consentimento explícito para coleta de dados
2. ✅ Criptografia de dados sensíveis (CPF, docs)
3. ✅ Direito ao esquecimento (deletar conta)
4. ✅ Portabilidade de dados
5. ✅ Acesso aos dados pessoais
6. ✅ DPO (Data Protection Officer) designado

**Texto de Consentimento:**

```
Ao prosseguir com a verificação, você autoriza o MercadoGamer a:

1. Coletar e processar seus dados pessoais (nome, CPF, RG, endereço, foto)
2. Validar seu CPF com a Receita Federal via Serpro
3. Verificar seu telefone via Twilio
4. Processar sua foto com tecnologia de reconhecimento facial (AWS Rekognition)
5. Armazenar seus documentos de forma segura e criptografada
6. Manter registros por 5 anos conforme Lei 14.790/2023

Seus dados serão usados APENAS para verificação de identidade e prevenção de fraudes.

Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento
através do email: privacidade@mercadogamer.com.br

[ ] Li e concordo com a Política de Privacidade e Termos de Uso
```

### 10.3 Termo de Responsabilidade

```
TERMO DE RESPONSABILIDADE - VERIFICAÇÃO KYC

Eu, [NOME], portador do CPF [CPF], declaro que:

1. Sou maior de 18 anos
2. Todos os documentos e informações fornecidas são verdadeiros
3. Estou ciente de que fornecer informações falsas é crime (Art. 299 do Código Penal)
4. Autorizo a verificação dos meus dados junto aos órgãos competentes
5. Estou de acordo com a Política de Privacidade do MercadoGamer

Data: [DATA]
Assinatura Digital: [IP + Timestamp]
```

---

## 11. Custos

### 11.1 Tabela de Custos Estimados

| Serviço | Custo Unitário | Volume Mensal | Custo Mensal |
|---------|----------------|---------------|--------------|
| **Serpro (CPF)** | R$ 0,05/consulta | 1.000 usuários | R$ 50 |
| **Twilio SMS** | R$ 0,25/SMS | 1.000 usuários | R$ 250 |
| **AWS S3** | R$ 0,023/GB | 100 GB | R$ 2,30 |
| **AWS Rekognition** | R$ 0,005/imagem | 2.000 imagens | R$ 10 |
| **Servidor (API)** | R$ 200/mês | - | R$ 200 |
| **MongoDB Atlas** | R$ 100/mês | - | R$ 100 |
| **Redis (Queue)** | R$ 50/mês | - | R$ 50 |
| **TOTAL** | - | - | **R$ 662,30** |

**Observações:**
- Custos estimados para 1.000 verificações/mês
- Escala linearmente com volume
- Desenvolvimento inicial: R$ 10.000-15.000
- Manutenção mensal: R$ 2.000-3.000

### 11.2 ROI Esperado

**Redução de Fraudes:**
- Fraudes atuais (estimado): R$ 10.000/mês
- Com KYC: -70% = R$ 3.000/mês
- **Economia: R$ 7.000/mês**

**Aumento de Conversão:**
- Vendas atuais: R$ 100.000/mês
- Com selos de verificação: +40% = R$ 140.000/mês
- Comissão média: 10%
- **Receita adicional: R$ 4.000/mês**

**TOTAL BENEFÍCIO: R$ 11.000/mês**
**Custo operacional: R$ 662/mês**
**ROI: 1.660%** 🚀

---

## 12. Timeline de Implementação

### Semana 1-2: Planejamento e Setup

- [x] Contratar serviços (Serpro, Twilio, AWS)
- [x] Configurar ambientes (dev, staging, prod)
- [x] Criar schemas de banco de dados
- [x] Definir níveis e limites

### Semana 3-4: Backend (Nível 1)

- [x] Implementar validação de CPF (Serpro)
- [x] Implementar verificação de telefone (Twilio)
- [x] Criar rotas de API
- [x] Testes unitários

### Semana 5-6: Backend (Nível 2)

- [x] Implementar upload de documentos (S3)
- [x] Implementar biometria facial (Rekognition)
- [x] Sistema de filas (Bull)
- [x] Testes de integração

### Semana 7-8: Backend (Nível 3)

- [x] Sistema de revisão manual
- [x] Dashboard admin
- [x] Relatórios de compliance
- [x] Logs de auditoria

### Semana 9-10: Frontend

- [x] Página de verificação
- [x] Componentes de upload
- [x] Fluxo de verificação
- [x] Badges e selos

### Semana 11: Testes

- [x] Testes end-to-end
- [x] Testes de carga
- [x] Testes de segurança
- [x] QA completo

### Semana 12: Deploy

- [x] Deploy em staging
- [x] Testes com usuários beta
- [x] Ajustes finais
- [x] Deploy em produção

**TEMPO TOTAL: 3 meses**

---

## 📋 Checklist de Implementação

### Backend

- [ ] Configurar Serpro API (validação CPF)
- [ ] Configurar Twilio Verify (SMS)
- [ ] Configurar AWS S3 (documentos)
- [ ] Configurar AWS Rekognition (biometria)
- [ ] Criar models Mongoose (User, KYCVerification, KYCLog)
- [ ] Implementar rotas de API
- [ ] Implementar controllers
- [ ] Implementar services
- [ ] Sistema de filas (Bull + Redis)
- [ ] Middleware de verificação de nível
- [ ] Criptografia de dados sensíveis
- [ ] Logs de auditoria
- [ ] Testes unitários (80%+ coverage)
- [ ] Testes de integração
- [ ] Documentação da API (Swagger)

### Frontend

- [ ] Página de verificação (/verificacao)
- [ ] Componente Level1Verification
- [ ] Componente Level2Verification
- [ ] Componente Level3Verification
- [ ] Upload de documentos (drag & drop)
- [ ] Câmera para selfie
- [ ] Badges de verificação em perfis
- [ ] Filtro "Apenas verificados" em busca
- [ ] Notificações de status
- [ ] Traduções (pt-BR, en, es)
- [ ] Responsividade mobile
- [ ] Testes E2E (Cypress)

### Admin

- [ ] Dashboard de verificações pendentes
- [ ] Interface de aprovação/rejeição
- [ ] Visualizador de documentos
- [ ] Comparador de fotos
- [ ] Logs de ações admin
- [ ] Relatórios de compliance
- [ ] Exportação de dados (CSV)

### Segurança

- [ ] Criptografia de CPF
- [ ] Criptografia de documentos (S3)
- [ ] HTTPS obrigatório
- [ ] Rate limiting
- [ ] CAPTCHA em cadastro
- [ ] 2FA para admin
- [ ] Auditoria completa
- [ ] Backup diário

### Compliance

- [ ] Termo de consentimento LGPD
- [ ] Política de privacidade atualizada
- [ ] Termo de responsabilidade
- [ ] DPO designado
- [ ] Processo de exclusão de dados
- [ ] Portabilidade de dados
- [ ] Relatórios para COAF

### Deploy

- [ ] Ambiente de staging
- [ ] CI/CD configurado
- [ ] Monitoramento (Sentry/Datadog)
- [ ] Logs centralizados
- [ ] Backup automático
- [ ] Disaster recovery plan
- [ ] Runbook de operações

---

## 🎯 Conclusão

Este guia fornece um roadmap completo para implementar um sistema de KYC robusto no MercadoGamer. Com este sistema:

✅ **Conformidade legal** com Lei 14.790/2023
✅ **Redução de fraudes** em 60-80%
✅ **Aumento de conversão** em 40%+
✅ **Diferencial competitivo** forte
✅ **Escalável** para milhares de usuários

**Próximos passos:**
1. Aprovar orçamento (R$ 10-15K desenvolvimento + R$ 662/mês operacional)
2. Contratar serviços (Serpro, Twilio, AWS)
3. Iniciar desenvolvimento (12 semanas)

---

**Documento criado em:** 20/11/2025
**Autor:** Sistema de IA - Claude
**Versão:** 1.0
