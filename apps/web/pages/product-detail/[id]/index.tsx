import { NextPage } from 'next';
import { DefaultLayout } from '@layout/default-layout';
import { ProductDetailProvider } from 'apps/web/src/page-contents/product-detail/context';
import { ProductDetailContent } from '@page-contents/product-detail';

const ProductDetail: NextPage = () => {
  return (
    <DefaultLayout>
      <ProductDetailProvider>
        <ProductDetailContent />
      </ProductDetailProvider>
    </DefaultLayout>
  );
};

export default ProductDetail;
