type Props = {
  label: string;
  value: string | number;
};

export const StatusCountCard: React.FC<Props> = ({ label, value }) => {
  return (
    <div className="status-count-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
};
