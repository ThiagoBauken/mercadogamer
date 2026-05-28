// @ts-nocheck - TypeScript compatibility fix
import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ProductDetailContext } from './context';
import { ProductDetail, ProductInfoItem, ProductQuestions, PurchaseCondition } from './widgets';
import { endpoints, get, getFileFullUrl, madeBackgroundImageUrl, ProductType } from '@utils';




import { ShortCutMenu } from '@web/components/shortcut-menu';
import { useTranslation } from 'next-i18next';


const BreadCrumb = dynamic(() => import('@widgets/bread-crumb').then(mod => mod.BreadCrumb), { ssr: false });

const RelatedProduct = dynamic(() => import('@components/related-product').then(mod => mod.RelatedProduct), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

export const ProductDetailContent: React.FC = () => {
  const { t } = useTranslation('products');
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
      console.error('Error loading product:', error);
      // Optionally show error message to user
    } finally {
      setLoading(false);
    }
  };

  // ─── SEO: derived values ──────────────────────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://mercadogamer.com.br';
  const productImageUrl = product?.picture ? getFileFullUrl(product.picture) : '';
  const sellerUsername =
    typeof product?.user === 'object' ? product?.user?.username : product?.user;
  const sellerQualification =
    typeof product?.user === 'object' ? product?.user?.sellerQualification : undefined;
  const sellerTotalQualifications =
    typeof product?.user === 'object' ? product?.user?.sellerTotalQualifications : undefined;
  const canonicalUrl = id ? `${siteUrl}/product-detail/${id}` : siteUrl;

  const jsonLd = product?.name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image: productImageUrl || undefined,
        offers: {
          '@type': 'Offer',
          price: String(product.price ?? ''),
          priceCurrency: 'BRL',
          availability:
            (product.stock ?? 0) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: sellerUsername
            ? { '@type': 'Person', name: sellerUsername }
            : undefined,
        },
        ...(sellerTotalQualifications > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(sellerQualification ?? ''),
                reviewCount: String(sellerTotalQualifications),
              },
            }
          : {}),
      }
    : null;

  const ogTitle = product?.name
    ? `${product.name} — MercadoGamer`
    : 'MercadoGamer';
  const ogDescription =
    product?.description || 'Compre e venda itens digitais no MercadoGamer';
  const ogImage = productImageUrl || `${siteUrl}/assets/imgs/og-meta-tag/MG-Logo.png`;

  return (
    <>
      <Head>
        {product?.name && <title>{ogTitle}</title>}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>
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
            { label: t('detail.catalog'), action: () => router.push('/catalogo') },
            { label: product?.type, action: () => router.push(`/catalogo?tipo=${product?.type}`) },
            {
              label: t('detail.this_product'),
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
          <div className="label">{t('detail.description')}</div>
          <div className="content">{product?.description}</div>
        </div>

        <div className="game-info">
          {/* <div
            className="image-container"
            style={{ backgroundImage: `url('${getFileFullUrl(product?.picture)}')` }}
          ></div> */}
          <div className="content">
            <ProductInfoItem
              label={t('detail.game')}
              value={typeof product.game === 'object' ? product.game?.name : product.game}
            />
            {/* <ProductInfoItem
              label={t('detail.platform')}
              value={
                typeof product.platform === 'object' ? product.platform?.name : product.platform
              }
            /> */}
            {/* <ProductInfoItem
              label={t('detail.level')}
              value={
                typeof product.platform === 'object'
                  ? product.publicationType
                  : product.publicationType
              }
            /> */}
            <ProductInfoItem
              label={t('detail.product_type')}
              value={product.type ? ProductType[product.type].label : ''}
            />
            {/* <ProductInfoItem label={t('detail.language')} value={'English'} /> */}
            <ProductInfoItem
              label={t('detail.category')}
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
    </>
  );
};
