import { useTypedSelector } from '@store';
import { Button } from '@widgets/button';
import { Modal } from '@widgets/modal';
import { Select } from '@widgets/select';
import { useState } from 'react';

type Props = {
  open: boolean;
  onAction: (value: string) => void;
  onClose: () => void;
};

export const OtherSelectGame: React.FC<Props> = ({ open, onAction, onClose }) => {
  const { games } = useTypedSelector((store) => store.game);

  const [value, setValue] = useState<string>('');

  return (
    <Modal open={open} header="Otro juego" contentClass="other-select-game-modal" onClose={onClose}>
      <Select
        label="Selecciona un juego"
        suggestion
        placeholder="Seleccionar"
        items={games.map((item) => ({ label: item.name, value: item.id }))}
        value={value}
        onChange={setValue}
      ></Select>
      <Button full disabled={!value} onClick={() => onAction(value)}>
        Enviar código
      </Button>
    </Modal>
  );
};
