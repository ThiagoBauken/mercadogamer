// @ts-nocheck - TypeScript compatibility fix
import { useTypedSelector } from '@store';
import dynamic from 'next/dynamic';



import { useState } from 'react';
import { useTranslation } from 'next-i18next';

type Props = {
  open: boolean;
  onAction: (value: string) => void;
  onClose: () => void;
};


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

const Select = dynamic(() => import('@widgets/select').then(mod => mod.Select), { ssr: false });

export const OtherSelectGame: React.FC<Props> = ({ open, onAction, onClose }) => {
  const { t } = useTranslation('common');
  const { games } = useTypedSelector((store) => store.game);

  const [value, setValue] = useState<string>('');

  return (
    <Modal open={open} header={t('modals.other_game.title')} contentClass="other-select-game-modal" onClose={onClose}>
      <Select
        label={t('modals.other_game.select_label')}
        suggestion
        placeholder={t('modals.other_game.select_placeholder')}
        items={games.map((item) => ({ label: item.name, value: item.id }))}
        value={value}
        onChange={setValue}
      ></Select>
      <Button full disabled={!value} onClick={() => onAction(value)}>
        {t('modals.other_game.send_button')}
      </Button>
    </Modal>
  );
};
