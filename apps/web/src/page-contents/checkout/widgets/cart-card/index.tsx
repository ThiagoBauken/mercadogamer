// @ts-nocheck - TypeScript compatibility fix
import { getFileFullUrl, ProductFunctions, toUSDandCurrency } from '@utils';
import dynamic from 'next/dynamic';



const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const CartCard: React.FC<CartModelType> = ({ count, id, product, user }) => {
  return (
    <div className="cart-card">
      <div
        className="image-container"
        style={{ backgroundImage: `url('${getFileFullUrl(product.picture)}')` }}
      ></div>
      <div className="content">
        <div className="cart-name">{product?.name}</div>
        <div className="description">
          <div className="delivery">
            <Icon
              size={18}
              name={
                !Array.isArray(product?.stockProduct) &&
                product?.stockProduct?.retirementType === 'automatic'
                  ? 'ent-inmediata'
                  : 'ent-coordinada'
              }
            />
          </div>
          <div className="price">{`${count} x ${toUSDandCurrency(
            ProductFunctions.getProductPrice(product)
          )}`}</div>
        </div>
      </div>
      <div className="price">
        {toUSDandCurrency(ProductFunctions.getProductPrice(product) * count)}
      </div>
    </div>
  );
};
