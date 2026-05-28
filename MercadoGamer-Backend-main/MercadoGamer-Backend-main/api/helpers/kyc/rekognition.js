'use strict';

/**
 * Helper de biometria facial — AWS Rekognition (P1.10 KYC nivel 2).
 *
 * Comportamento:
 *   - Se AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY no env → modo REAL (Rekognition compareFaces)
 *   - Caso contrário → modo MOCK (retorna match = true com score 90 — bom pra dev/staging)
 *
 * Custo real: $0.001 por compareFaces (~R$ 0.005 por verificacao).
 *
 * Threshold padrão: 85% (= alta confiança que é a mesma pessoa).
 * Match < 85 = manual review pela administracao.
 *
 * Use via: const rek = require('../helpers/kyc/rekognition')
 *          const result = await rek.compareFaces(documentPath, selfiePath)
 */

const fs = require('fs');

async function compareFacesMock(documentPath, selfiePath) {
  // Validar que os arquivos existem
  if (!fs.existsSync(documentPath)) return { error: 'documento nao encontrado', provider: 'mock' };
  if (!fs.existsSync(selfiePath)) return { error: 'selfie nao encontrada', provider: 'mock' };

  return {
    match: true,
    similarity: 90.0,
    threshold: 85,
    provider: 'mock',
    note: 'AWS_ACCESS_KEY_ID nao configurado — sempre aprova em modo MOCK',
  };
}

async function compareFacesAWS(documentPath, selfiePath) {
  // Lazy require pra nao falhar load se aws-sdk nao estiver instalado
  let AWS;
  try {
    AWS = require('@aws-sdk/client-rekognition');
  } catch (e) {
    return {
      error: '@aws-sdk/client-rekognition nao instalado — rode `npm i @aws-sdk/client-rekognition`',
      provider: 'aws',
    };
  }

  try {
    const client = new AWS.RekognitionClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const sourceBytes = fs.readFileSync(documentPath);
    const targetBytes = fs.readFileSync(selfiePath);

    const cmd = new AWS.CompareFacesCommand({
      SourceImage: { Bytes: sourceBytes },
      TargetImage: { Bytes: targetBytes },
      SimilarityThreshold: 85,
    });

    const resp = await client.send(cmd);
    const matches = resp.FaceMatches || [];
    if (matches.length === 0) {
      return {
        match: false,
        similarity: 0,
        threshold: 85,
        provider: 'aws',
        note: 'Nenhum rosto detectado correspondendo',
      };
    }
    const best = matches[0];
    const similarity = best.Similarity || 0;
    return {
      match: similarity >= 85,
      similarity,
      threshold: 85,
      provider: 'aws',
    };
  } catch (err) {
    return {
      error: `AWS Rekognition falhou: ${err.message}`,
      provider: 'aws',
    };
  }
}

async function compareFaces(documentPath, selfiePath) {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return compareFacesAWS(documentPath, selfiePath);
  }
  return compareFacesMock(documentPath, selfiePath);
}

module.exports = (helper) => ({
  compareFaces,
  _mock: compareFacesMock,
  _aws: compareFacesAWS,
});
