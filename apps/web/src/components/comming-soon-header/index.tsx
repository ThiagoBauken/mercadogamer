import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const CommingSoonHeader: React.FC = () => {
  const router = useRouter();

  const [icon, setIcon] = useState<string>('');

  const communications = useMemo<{ icon: string; path: string }[]>(
    () => [
      { icon: 'instagram', path: '/' },
      { icon: 'tiktok', path: '/' },
      { icon: 'youtube', path: '/' },
      { icon: 'facebook', path: '/' },
      { icon: 'twitter', path: '/' },
    ],
    []
  );

  return (
    <header className="mercado-comming-soon-layout-header">
      <div className="logo" onClick={() => router.push('/')}>
        <Icon name="logo" />
      </div>
      <ul className="communication">
        {communications.map((item, index) => (
          <li key={index} onMouseMove={() => setIcon(item.icon)} onMouseLeave={() => setIcon('')}>
            <Icon name={icon === item.icon ? `${item.icon}-active` : item.icon} />
          </li>
        ))}
      </ul>
    </header>
  );
};

export { CommingSoonHeader };
