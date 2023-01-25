import { Select } from '@widgets/select';

type Props = {
  label: string;
  items: MenuItemProps[];
  value: string;
  onChange: (value: string) => void;
};
export const ActionMenuItem: React.FC<Props> = ({ label, items, value, onChange }) => {
  return (
    <div className="action-menu-item">
      <div className="label">{label}</div>
      <Select items={items} value={value} onChange={onChange} miniSize />
    </div>
  );
};
