import { useEffect, useState } from 'react';
import { endpoints, get, getRandomArrayElements, httpGetAll } from '@utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ProductCard = dynamic(() => import('../../components/product-card/index'));

export const RelatedProduct: React.FC<{ value: ProductModelType }> = (value) => {
  const [state, setState] = useState<{
    products: ProductModelType[];
  }>({ products: [] });

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    loadFeaturedProduct();
  }, [value.value.id]);

  const loadFeaturedProduct = async (): Promise<void> => {
    setLoading(true);
    try {
      const id = value.value.id;
      const response = await get(`${endpoints.productsUrl}/getRecommendProducts/${id}`);

      setState({ ...state, products: getRandomArrayElements(response.data || [], 5) });
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
        {state.products.length === 0 ? (
          <div className="empty">Estos productos recomendados no existen.</div>
        ) : (
          Array.isArray(state.products) &&
          state.products.map((product, index) => (
            <li key={index}>
              <ProductCard
                product={product}
                hideAction
                href={`/product-detail/${typeof product === 'string' ? product : product.id}`}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
