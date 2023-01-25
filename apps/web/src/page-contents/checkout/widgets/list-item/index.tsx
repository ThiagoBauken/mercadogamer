export const ListItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="list-item">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
};
