import { useTranslation } from 'next-i18next';
import { getFileFullUrl, ProductFunctions, toUSDandCurrency } from '@utils';

import Tooltip from '@widgets/tooltip';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useWindowSize } from '../../../../../libs/ui-shared/src/hooks';

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

type Props = {
  product: ProductModelType;
  hideAction?: boolean;
  onClick?: () => void;
  passedRef?: (node: HTMLDivElement | null) => void;
  href: string;
};

const ProductCard: React.FC<Props> = (props) => {
  const { t } = useTranslation('products');
  const { product, hideAction = false, passedRef, href } = props;
  const fileUrl = `${process.env.NEXT_PUBLIC_FILE_URL}/${product?.picture}`;
  const classNames = useMemo<string>(() => {
    const classes = ['mercado-product-card'];
    hideAction && classes.push('card-action');
    return classes.join(' ');
  }, [hideAction]);

  const { width } = useWindowSize();

  const CardIcon = () => (
    <div className="icon">
      <Tooltip
        position="top"
        tooltip={
          !Array.isArray(product?.stockProduct) &&
            product?.stockProduct?.retirementType === 'automatic'
            ? t('card.delivery_automatic')
            : t('card.delivery_coordinated')
        }
      >
        <Icon
          size={18}
          name={
            !Array.isArray(product?.stockProduct) &&
              product?.stockProduct?.retirementType === 'automatic'
              ? 'ent-inmediata'
              : 'ent-coordinada'
          }
        />
      </Tooltip>
    </div>
  );

  return (
    <div ref={passedRef} className={classNames}>
      <Link href={href || ''}>
        <div className="product-img">
          <div
            className="game-logo"
            style={{
              backgroundImage: `url('${getFileFullUrl(product?.game?.picture)}')`,
            }}
          ></div>
          {fileUrl ? (
            <Image
              src={fileUrl}
              loading="lazy"
              width={206.75}
              height={229.33}
              alt="product"
              placeholder="blur"
              blurDataURL="blur"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <div
              className="image-container"
              style={{ backgroundImage: `url('/assets/imgs/placeholder.svg')` }}
            ></div>
          )}
          <div className="portfolio-overlay"></div>
        </div>
      </Link>
      <Link href={href || ''}>
        <div className="title">
          {product?.name}
        </div>
      </Link>

      <div className="price-content">
        <Link href={href || ''}>
          <div className="price">
            {toUSDandCurrency(ProductFunctions.getProductPrice(product))}
          </div>
        </Link>

        {width < 992 ? (
          <CardIcon />
        ) : (
          <Link href={href || ''}>
            <CardIcon />
          </Link>
        )}

      </div>
      {!hideAction && (
        <div className="action">
          <Button onClick={props.onClick}>
            {t('card.add_button')}
            <span>
              <Icon size={18} name={'shopping-cart'}></Icon>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
