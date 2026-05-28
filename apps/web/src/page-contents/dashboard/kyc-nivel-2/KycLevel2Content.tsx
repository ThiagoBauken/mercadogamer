// @ts-nocheck - TypeScript compatibility fix
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useTypedSelector } from '@store';
import { addMessageToToast, endpoints, get, post } from '@utils';
import { ThemeColor } from '@theme/color';

// ─── Types ───────────────────────────────────────────────────────────────────

type Level2Status = 'none' | 'pending' | 'manual_review' | 'approved' | 'rejected';

interface KycLevel2StatusResponse {
  status: Level2Status;
  faceMatchScore?: number;
  rejectionReason?: string;
}

interface SubmitDocumentPhotosResponse {
  status: Level2Status;
  message?: string;
}

// ─── Styled Components ───────────────────────────────────────────────────────

const PageWrapper = styled.section`
  padding: 24px;
  max-width: 860px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${ThemeColor['gray-50']};
  margin: 0 0 24px 0;
`;

const SuccessBanner = styled.div`
  background: rgba(60, 255, 42, 0.1);
  border: 1px solid ${ThemeColor.positive};
  border-radius: 8px;
  padding: 14px 18px;
  color: ${ThemeColor.positive};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const WarningBanner = styled.div`
  background: rgba(247, 138, 14, 0.1);
  border: 1px solid ${ThemeColor.primary};
  border-radius: 8px;
  padding: 14px 18px;
  color: ${ThemeColor.primary};
  font-size: 14px;
  margin-bottom: 24px;
`;

const ErrorBanner = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid #ff3b30;
  border-radius: 8px;
  padding: 14px 18px;
  color: #ff3b30;
  font-size: 14px;
  margin-bottom: 24px;
`;

const RequiresLevel1Banner = styled.div`
  background: rgba(247, 138, 14, 0.08);
  border: 1px solid ${ThemeColor['gray-80']};
  border-radius: 8px;
  padding: 18px 22px;
  margin-bottom: 24px;

  p {
    color: ${ThemeColor['gray-30']};
    font-size: 14px;
    margin: 0 0 10px 0;
  }

  a {
    color: ${ThemeColor.primary};
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const UploadsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const UploadCard = styled.div<{ $blocked?: boolean }>`
  background: ${ThemeColor['gray-110']};
  border: 1px solid ${ThemeColor['gray-90']};
  border-radius: 12px;
  padding: 20px 24px;
  opacity: ${({ $blocked }) => ($blocked ? 0.5 : 1)};
  pointer-events: ${({ $blocked }) => ($blocked ? 'none' : 'auto')};
`;

const CardTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
`;

const CardSubtitle = styled.p`
  font-size: 13px;
  color: ${ThemeColor['gray-50']};
  margin: 0 0 14px 0;
`;

const OptionalTag = styled.span`
  font-size: 12px;
  color: ${ThemeColor['gray-60']};
  font-weight: 400;
  margin-left: 6px;
`;

const UploadArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const PreviewBox = styled.div`
  width: 110px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${ThemeColor['gray-80']};
  background: ${ThemeColor['gray-100']};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderBox = styled.div`
  width: 110px;
  height: 80px;
  border-radius: 8px;
  border: 2px dashed ${ThemeColor['gray-80']};
  background: ${ThemeColor['gray-100']};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${ThemeColor['gray-60']};
  font-size: 12px;
  text-align: center;
  padding: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const FileInputLabel = styled.label`
  background: ${ThemeColor.primary};
  color: ${ThemeColor['gray-130']};
  border: none;
  border-radius: 50px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  input {
    display: none;
  }
`;

const ResendButton = styled.button`
  background: ${ThemeColor['gray-80']};
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const UploadingText = styled.span`
  font-size: 13px;
  color: ${ThemeColor.primary};
`;

const SubmitButton = styled.button<{ $loading?: boolean; $disabled?: boolean }>`
  background: ${ThemeColor.primary};
  color: ${ThemeColor['gray-130']};
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: ${({ $loading, $disabled }) => ($loading || $disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading, $disabled }) => ($loading || $disabled ? 0.5 : 1)};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

const ResultBanner = styled.div<{ $variant: 'success' | 'warning' | 'error' }>`
  border-radius: 8px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 20px;

  ${({ $variant }) => {
    if ($variant === 'success') {
      return `
        background: rgba(60, 255, 42, 0.1);
        border: 1px solid ${ThemeColor.positive};
        color: ${ThemeColor.positive};
      `;
    }
    if ($variant === 'warning') {
      return `
        background: rgba(247, 138, 14, 0.1);
        border: 1px solid ${ThemeColor.primary};
        color: ${ThemeColor.primary};
      `;
    }
    return `
      background: rgba(255, 59, 48, 0.1);
      border: 1px solid #ff3b30;
      color: #ff3b30;
    `;
  }}
`;

// ─── Component ───────────────────────────────────────────────────────────────

export const KycLevel2Content: React.FC = () => {
  const { t } = useTranslation('kyc');

  // Read kycLevel from backend status (not from Redux user — field not in UserModelType)
  const [level2Status, setLevel2Status] = useState<KycLevel2StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Track user's overall KYC level by reading from level1 status endpoint
  const [userKycLevel, setUserKycLevel] = useState<number>(0);

  // Photo state: url returned by upload API
  const [frontUrl, setFrontUrl] = useState<string>('');
  const [backUrl, setBackUrl] = useState<string>('');
  const [selfieUrl, setSelfieUrl] = useState<string>('');

  // Preview object URLs (local, for display only)
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');

  // Per-slot uploading spinners
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  // Final submission
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<Level2Status | null>(null);

  // File input refs
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  // ─── Load initial statuses ─────────────────────────────────────────────────

  useEffect(() => {
    loadStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStatuses = async () => {
    try {
      setLoadingStatus(true);

      // Load level-1 status to check if user has kycLevel >= 1
      const [level1Res, level2Res] = await Promise.all([
        get(endpoints.kycStatusUrl).catch(() => null),
        get(endpoints.kycLevel2StatusUrl).catch(() => null),
      ]);

      if (level1Res?.data) {
        setUserKycLevel(level1Res.data.kycLevel ?? 0);
      }

      if (level2Res?.data) {
        setLevel2Status(level2Res.data);
      }
    } catch (error) {
      addMessageToToast(t('errors.loadStatus'), { status: 'error', icon: 'alert-triangle' });
    } finally {
      setLoadingStatus(false);
    }
  };

  // ─── Upload helper ─────────────────────────────────────────────────────────

  const uploadPhoto = async (
    file: File,
    setUrl: (url: string) => void,
    setPreview: (url: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    setUploading(true);
    try {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      const fd = new FormData();
      fd.append('file', file);
      const res = await post(`${endpoints.fileUrl}/upload`, fd);
      const filename: string = res?.data?.data?.file ?? res?.data?.file ?? '';
      setUrl(filename);
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' },
      );
      // Clear preview on error
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setPreview: (url: string) => void,
    setUploading: (v: boolean) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file, setUrl, setPreview, setUploading);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // ─── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!frontUrl || !selfieUrl) return;
    try {
      setSubmitting(true);
      const body: Record<string, string> = {
        documentPhotoUrl: frontUrl,
        selfiePhotoUrl: selfieUrl,
      };
      if (backUrl) {
        body.documentPhotoBackUrl = backUrl;
      }
      const res = await post(endpoints.kycSubmitDocumentPhotosUrl, body);
      const resultStatus: Level2Status = res?.data?.status ?? 'manual_review';
      setSubmitResult(resultStatus);
      // Refresh level2 status from backend
      await loadStatuses();
    } catch (error) {
      addMessageToToast(
        error?.response?.data?.message || t('errors.generic'),
        { status: 'error', icon: 'alert-triangle' },
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetPhotos = () => {
    setFrontUrl('');
    setBackUrl('');
    setSelfieUrl('');
    setFrontPreview('');
    setBackPreview('');
    setSelfiePreview('');
    setSubmitResult(null);
  };

  // ─── Derived state ─────────────────────────────────────────────────────────

  const canSubmit = Boolean(frontUrl && selfieUrl && !submitting);
  const currentStatus = level2Status?.status ?? 'none';
  const showUploads = currentStatus === 'none' || currentStatus === 'rejected';

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (loadingStatus) {
    return (
      <PageWrapper>
        <PageTitle>{t('level2.title')}</PageTitle>
        <PageSubtitle style={{ marginTop: 16 }}>Carregando...</PageSubtitle>
      </PageWrapper>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      <PageTitle>{t('level2.title')}</PageTitle>
      <PageSubtitle>{t('level2.description')}</PageSubtitle>

      {/* ── Requires level 1 gate ──────────────────────────────────────────── */}
      {userKycLevel < 1 ? (
        <RequiresLevel1Banner>
          <p>{t('level2.requires_level1')}</p>
          <Link href="/dashboard/kyc">
            {t('nav.kyc', { defaultValue: 'Verificação KYC (nível 1)' })}
          </Link>
        </RequiresLevel1Banner>
      ) : (
        <>
          {/* ── Status banners ─────────────────────────────────────────────── */}
          {currentStatus === 'approved' && (
            <SuccessBanner>{t('level2.success_approved')}</SuccessBanner>
          )}

          {(currentStatus === 'pending' || currentStatus === 'manual_review') && (
            <WarningBanner>
              {t('level2.review_pending')}
              {level2Status?.faceMatchScore != null && (
                <span> — faceMatchScore: {Math.round(level2Status.faceMatchScore * 100)}%</span>
              )}
            </WarningBanner>
          )}

          {currentStatus === 'rejected' && (
            <ErrorBanner>
              {t('level2.rejected')}
              {level2Status?.rejectionReason && (
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 400 }}>
                  {level2Status.rejectionReason}
                </div>
              )}
            </ErrorBanner>
          )}

          {/* ── Upload section (visible when none or rejected) ─────────────── */}
          {showUploads && (
            <>
              <UploadsGrid>
                {/* Step 1 — Document front */}
                <UploadCard>
                  <CardTitle>{t('level2.step1')}</CardTitle>
                  <CardSubtitle>RG ou CNH — frente</CardSubtitle>
                  <UploadArea>
                    {frontPreview ? (
                      <PreviewBox>
                        <img src={frontPreview} alt="Documento frente" />
                      </PreviewBox>
                    ) : (
                      <PlaceholderBox>Sem foto</PlaceholderBox>
                    )}
                    <ButtonRow>
                      {uploadingFront ? (
                        <UploadingText>{t('level2.uploading')}</UploadingText>
                      ) : (
                        <>
                          {!frontPreview ? (
                            <FileInputLabel>
                              Selecionar foto
                              <input
                                ref={frontRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) =>
                                  handleFileChange(e, setFrontUrl, setFrontPreview, setUploadingFront)
                                }
                              />
                            </FileInputLabel>
                          ) : (
                            <ResendButton
                              onClick={() => {
                                setFrontUrl('');
                                setFrontPreview('');
                                frontRef.current?.click();
                              }}
                            >
                              Reenviar
                            </ResendButton>
                          )}
                          {/* Hidden input for re-trigger */}
                          {frontPreview && (
                            <input
                              ref={frontRef}
                              type="file"
                              accept="image/*"
                              capture="environment"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileChange(e, setFrontUrl, setFrontPreview, setUploadingFront)
                              }
                            />
                          )}
                        </>
                      )}
                    </ButtonRow>
                  </UploadArea>
                </UploadCard>

                {/* Step 2 — Document back (optional) */}
                <UploadCard>
                  <CardTitle>
                    {t('level2.step2')}
                    <OptionalTag>(opcional)</OptionalTag>
                  </CardTitle>
                  <CardSubtitle>RG ou CNH — verso</CardSubtitle>
                  <UploadArea>
                    {backPreview ? (
                      <PreviewBox>
                        <img src={backPreview} alt="Documento verso" />
                      </PreviewBox>
                    ) : (
                      <PlaceholderBox>Sem foto</PlaceholderBox>
                    )}
                    <ButtonRow>
                      {uploadingBack ? (
                        <UploadingText>{t('level2.uploading')}</UploadingText>
                      ) : (
                        <>
                          {!backPreview ? (
                            <FileInputLabel>
                              Selecionar foto
                              <input
                                ref={backRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) =>
                                  handleFileChange(e, setBackUrl, setBackPreview, setUploadingBack)
                                }
                              />
                            </FileInputLabel>
                          ) : (
                            <ResendButton
                              onClick={() => {
                                setBackUrl('');
                                setBackPreview('');
                                backRef.current?.click();
                              }}
                            >
                              Reenviar
                            </ResendButton>
                          )}
                          {backPreview && (
                            <input
                              ref={backRef}
                              type="file"
                              accept="image/*"
                              capture="environment"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileChange(e, setBackUrl, setBackPreview, setUploadingBack)
                              }
                            />
                          )}
                        </>
                      )}
                    </ButtonRow>
                  </UploadArea>
                </UploadCard>

                {/* Step 3 — Selfie */}
                <UploadCard>
                  <CardTitle>{t('level2.step3')}</CardTitle>
                  <CardSubtitle>Selfie segurando o documento</CardSubtitle>
                  <UploadArea>
                    {selfiePreview ? (
                      <PreviewBox>
                        <img src={selfiePreview} alt="Selfie" />
                      </PreviewBox>
                    ) : (
                      <PlaceholderBox>Sem foto</PlaceholderBox>
                    )}
                    <ButtonRow>
                      {uploadingSelfie ? (
                        <UploadingText>{t('level2.uploading')}</UploadingText>
                      ) : (
                        <>
                          {!selfiePreview ? (
                            <FileInputLabel>
                              Selecionar foto
                              <input
                                ref={selfieRef}
                                type="file"
                                accept="image/*"
                                capture="user"
                                onChange={(e) =>
                                  handleFileChange(e, setSelfieUrl, setSelfiePreview, setUploadingSelfie)
                                }
                              />
                            </FileInputLabel>
                          ) : (
                            <ResendButton
                              onClick={() => {
                                setSelfieUrl('');
                                setSelfiePreview('');
                                selfieRef.current?.click();
                              }}
                            >
                              Reenviar
                            </ResendButton>
                          )}
                          {selfiePreview && (
                            <input
                              ref={selfieRef}
                              type="file"
                              accept="image/*"
                              capture="user"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileChange(e, setSelfieUrl, setSelfiePreview, setUploadingSelfie)
                              }
                            />
                          )}
                        </>
                      )}
                    </ButtonRow>
                  </UploadArea>
                </UploadCard>
              </UploadsGrid>

              {/* Submit button */}
              <SubmitButton
                onClick={handleSubmit}
                $loading={submitting}
                $disabled={!canSubmit}
                disabled={!canSubmit}
              >
                {submitting ? t('level2.uploading') : t('level2.submit')}
              </SubmitButton>

              {/* Inline result after submission */}
              {submitResult && (
                <ResultBanner
                  $variant={
                    submitResult === 'approved'
                      ? 'success'
                      : submitResult === 'rejected'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {submitResult === 'approved' && t('level2.success_approved')}
                  {(submitResult === 'pending' || submitResult === 'manual_review') &&
                    t('level2.review_pending')}
                  {submitResult === 'rejected' && t('level2.rejected')}
                </ResultBanner>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
};
