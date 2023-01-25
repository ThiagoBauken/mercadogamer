import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProductDetailContext } from './context';
import { ProductDetail, ProductInfoItem, ProductQuestions, PurchaseCondition } from './widgets';
import { endpoints, get, getFileFullUrl, madeBackgroundImageUrl, ProductType } from '@utils';
import { BreadCrumb } from '@widgets/bread-crumb';
import { RelatedProduct } from '@components/related-product';
import { Icon } from '@widgets/icon';
import { Button } from '@widgets/button';
import { ShortCutMenu } from '@web/components/shortcut-menu';

export const ProductDetailContent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const {
    state: { product },
    actions: { setLoading, setProduct },
  } = useContext(ProductDetailContext);

  const loadProduct = async (): Promise<void> => {
    setLoading(true);
    try {
      const productResponse = await get(`${endpoints.productsUrl}/${id}/`, {
        _populates: ['platform', 'category', 'user', 'stockProduct', 'game'],
      });

      setProduct(productResponse.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-detail-content">
      <div
        className="background"
        style={{
          backgroundImage: `radial-gradient(96.34% 93.34% at 0% 0%, rgba(17, 18, 23, 0.4) 0%, #111217 70%), url(
            '/assets/imgs/games/default-02.webp'
          )`,
        }}
      ></div>

      <div className="bread-crumb">
        <BreadCrumb
          items={[
            { label: 'Catálogo', action: () => router.push('/catalogo') },
            { label: product?.type, action: () => router.push(`/catalogo?tipo=${product?.type}`) },
            {
              label: 'Este producto',
            },
          ]}
        />
      </div>

      <div className="descriptions">
        <div className="image-container">
          <div
            className="game-logo"
            style={{
              backgroundImage: madeBackgroundImageUrl(getFileFullUrl(product?.game?.picture), ''),
            }}
          ></div>
          <div className="content">
            <div
              className="product-image"
              style={{ backgroundImage: `url('${getFileFullUrl(product?.picture)}')` }}
            ></div>
          </div>
        </div>

        <div className="description">
          <div className="label">Descripción</div>
          <div className="content">{product?.description}</div>
        </div>

        <div className="game-info">
          {/* <div
            className="image-container"
            style={{ backgroundImage: `url('${getFileFullUrl(product?.picture)}')` }}
          ></div> */}
          <div className="content">
            <ProductInfoItem
              label="Juego"
              value={typeof product.game === 'object' ? product.game?.name : product.game}
            />
            {/* <ProductInfoItem
              label="Plataforma"
              value={
                typeof product.platform === 'object' ? product.platform?.name : product.platform
              }
            /> */}
            {/* <ProductInfoItem
              label="Nivel"
              value={
                typeof product.platform === 'object'
                  ? product.publicationType
                  : product.publicationType
              }
            /> */}
            <ProductInfoItem
              label="Tipo de producto"
              value={product.type ? ProductType[product.type].label : ''}
            />
            {/* <ProductInfoItem label="Idioma" value={'English'} /> */}
            <ProductInfoItem
              label="Categoría"
              value={
                typeof product.category === 'object' ? product.category?.name : product.category
              }
            />
          </div>
        </div>

        <ProductQuestions value={product} />

        <PurchaseCondition />
      </div>
      <div className="detail">
        <ProductDetail />
      </div>
      {Object.keys(product).length > 0 && <RelatedProduct value={product} />}

      <div className="shortcut-action">
        {activeShortcut === false ? (
          <Button className="action" onClick={() => setShowShortcut(true)}>
            <Icon name="help-circle" />
          </Button>
        ) : (
          <Button className="action" onClick={() => setShowShortcut(false)}>
            <Icon name="close" />
          </Button>
        )}
        {activeShortcut === true && (
          <div className="stortcut-content">
            <ShortCutMenu />
          </div>
        )}
      </div>
    </div>
  );
};
