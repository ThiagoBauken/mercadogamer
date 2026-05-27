// @ts-nocheck - TypeScript compatibility fix
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation, useI18next } from 'next-i18next';
import { Icon } from '@widgets/icon';
import { Select } from '@widgets/select';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const [state, setState] = useState<{ communication: string }>({ communication: '' });

  // Idiomas disponíveis
  const languages = useMemo(() => [
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'en', label: '🇺🇸 English' },
    { code: 'es', label: '🇪🇸 Español' }
  ], []);

  // Idioma atual
  const currentLanguage = useMemo(() => {
    const lang = languages.find(l => l.code === i18n.language);
    return lang ? lang.label : languages[0].label;
  }, [i18n.language, languages]);

  // Moeda atual (baseada no idioma)
  const currentCurrency = useMemo(() => {
    return t('currency.full');
  }, [t, i18n.language]);

  // Trocar idioma
  const handleLanguageChange = (newLang: string) => {
    const langCode = languages.find(l => l.label === newLang)?.code;
    if (langCode && langCode !== i18n.language) {
      i18n.changeLanguage(langCode);
      router.push(router.asPath, router.asPath, { locale: langCode });
    }
  };

  const places = useMemo<{ label: string; path: string }[]>(
    () => [
      { label: t('footer.home'), path: '/' },
      { label: t('footer.catalog'), path: '/catalogo' },
      { label: t('footer.gifts'), path: '/regalos' },
      { label: t('footer.support'), path: '/dashboard/support' },
    ],
    [t]
  );

  const informations = useMemo<{ label: string; path: string }[]>(
    () => [
      { label: t('footer.terms_conditions'), path: '/term-condition/101' },
      { label: t('footer.security_privacy'), path: '/security-privacy/101' },
      { label: t('footer.help_center'), path: '/help-center' },
      { label: t('footer.sell_on_mg'), path: '/dashboard/inventory/add' },
    ],
    [t]
  );

  const communications = useMemo<{ icon: string; path: string }[]>(
    () => [
      { icon: 'instagram', path: 'https://www.instagram.com/mercadogamer_com' },
      { icon: 'tiktok', path: 'https://www.tiktok.com/@mercadogamer_com' },
      { icon: 'youtube', path: 'https://www.youtube.com/channel/UCHC244tuk8jQUNRXqMfBn2g' },
      { icon: 'facebook', path: 'https://www.facebook.com/Mercado-Gamer-106240401823512' },
    ],
    []
  );
  return (
    <footer className="mercado-default-layout-footer">
      <div className="site-information">
        <div className="logo">
          <Icon name="logo" size={61} />
        </div>
        <div className="support">
          <div className="icon">
            <Icon name="mail" />
          </div>
          <div className="value">soporte@mercadogamer.com</div>
        </div>
      </div>

      <div className="place">
        <div className="label">{t('footer.site')}</div>
        <ul>
          {places.map((item, index) => (
            <li key={index} onClick={() => router.push(item.path)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="information">
        <div className="label">{t('footer.information')}</div>
        <ul>
          {informations.map((item, index) => (
            <li key={index} onClick={() => router.push(item.path)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="communication">
        <div className="label">{t('footer.community')}</div>
        <ul>
          {communications.map((item, index) => (
            <li
              key={index}
              onClick={() => window.open(item.path)}
              onMouseOver={() => setState({ ...state, communication: item.icon })}
              onMouseOut={() => setState({ ...state, communication: '' })}
            >
              <div className="icon">
                <Icon
                  name={state.communication === item.icon ? `${item.icon}-active` : item.icon}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="select-group">
        <Select
          width="100%"
          items={[currentCurrency]}
          value={currentCurrency}
        />
        <Select
          width="100%"
          items={languages.map(l => l.label)}
          value={currentLanguage}
          onChange={handleLanguageChange}
        />
      </div>
    </footer>
  );
};
