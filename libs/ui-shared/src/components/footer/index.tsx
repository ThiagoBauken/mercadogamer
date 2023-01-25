import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '@widgets/icon';
import { Select } from '@widgets/select';

export const Footer: React.FC = () => {
  const router = useRouter();

  const [state, setState] = useState<{ communication: string }>({ communication: '' });

  const places = useMemo<{ label: string; path: string }[]>(
    () => [
      { label: 'Home', path: '/' },
      { label: 'Catálogo', path: '/catalogo' },
      { label: 'Regalos', path: '/regalos' },
      { label: 'Soporte', path: '/dashboard/support' },
    ],
    []
  );

  const informations = useMemo<{ label: string; path: string }[]>(
    () => [
      { label: 'Términos y condiciones', path: '/term-condition/101' },
      { label: 'Seguridad y privacidad', path: '/security-privacy/101' },
      { label: 'Centro de ayuda', path: '/help-center' },
      { label: 'Vender en MG', path: '/dashboard/inventory/add' },
    ],
    []
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
        <div className="label">Sitio</div>
        <ul>
          {places.map((item, index) => (
            <li key={index} onClick={() => router.push(item.path)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="information">
        <div className="label">Información</div>
        <ul>
          {informations.map((item, index) => (
            <li key={index} onClick={() => router.push(item.path)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="communication">
        <div className="label">Comunidad</div>
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
        <Select width="100%" items={['ARS - Peso argentino']} value={'ARS - Peso argentino'} />
        <Select width="100%" items={['Español']} value={'Español'} />
      </div>
    </footer>
  );
};
