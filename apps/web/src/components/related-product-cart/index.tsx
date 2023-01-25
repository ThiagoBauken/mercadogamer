import { useEffect, useState } from 'react';
import { endpoints, get, getRandomArrayElements, httpGetAll } from '@utils';
import { useRouter } from 'next/router';
import { useTypedSelector } from '@web/store';
import dynamic from 'next/dynamic';

const ProductCard = dynamic(() => import('../../components/product-card/index'));

export const RelatedProductCart: React.FC = () => {
  const [state, setState] = useState<{
    products: ProductModelType[];
  }>({ products: [] });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    auth: { user },
    cart: { discount, carts },
  } = useTypedSelector((store) => store);

  useEffect(() => {
    loadFeaturedProduct();
  }, []);

  const loadFeaturedProduct = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await httpGetAll(endpoints.productsUrl, {
        filter: {
          status: 'approved',
          enabled: true,
          stock: { $gt: 0 },
        },
        populate: ['platform', 'category', 'game'],
      });

      setState({ ...state, products: getRandomArrayElements(response.data?.data || [], 5) });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="related-product">
      <div className="label">También te puede interesar</div>
      <ul>
        {Array.isArray(state.products) &&
          state.products.map((product, index) => (
            <li key={index}>
              <ProductCard
                product={product}
                hideAction
                href={`/product-detail/${typeof product === 'string' ? product : product.id}`}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};
