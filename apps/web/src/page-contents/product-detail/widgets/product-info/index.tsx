type ProductInfoItemType = {
  label: string;
  value: string;
};

export const ProductInfoItem: React.FC<ProductInfoItemType> = ({ label, value }) => (
  <div className="product-info-item">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);
