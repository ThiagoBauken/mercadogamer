// @ts-nocheck - TypeScript compatibility fix
import { getCategories, getPlatforms, useAppDispatch } from '@store';
import { addMessageToToast, endpoints, madeBackgroundImageUrl, post } from '@utils';


import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getGames } from '@actions/game';
import dynamic from 'next/dynamic';
import { verifyProduct } from '../../../../../../libs/ui-shared/src/utils/product-functions';
import { useTranslation } from 'next-i18next';

const EditPrice = dynamic(() => import('./widgets').then(mod => mod.EditPrice), { ssr: false });
const ProductDetail = dynamic(() => import('./widgets').then(mod => mod.ProductDetail), { ssr: false });
const SelectDeliveryType = dynamic(() => import('./widgets').then(mod => mod.SelectDeliveryType), { ssr: false });
const SelectProductGame = dynamic(() => import('./widgets').then(mod => mod.SelectProductGame), { ssr: false });
const SelectProductType = dynamic(() => import('./widgets').then(mod => mod.SelectProductType), { ssr: false });
const SelectPublication = dynamic(() => import('./widgets').then(mod => mod.SelectPublication), { ssr: false });
const StepAddProduct = dynamic(() => import('./widgets').then(mod => mod.StepAddProduct), { ssr: false });


const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Modal = dynamic(() => import('@widgets/modal').then(mod => mod.Modal), { ssr: false });

export const AddProductContent: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [state, setState] = useState<{ step: number; maxStep: number; modal: { name: string } }>({
    step: 1,
    maxStep: 1,
    modal: { name: '' },
  });

  const formController = useForm<CreateProductModelType>({});
  const { setValue, handleSubmit, watch } = formController;

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (state.step > state.maxStep) setState({ ...state, maxStep: state.step });
  }, [state.step]);

  const initData = async (): Promise<void> => {
    try {
      dispatch(getGames());
      dispatch(getPlatforms());
      dispatch(getCategories());
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (product: CreateProductModelType): Promise<void> => {
    try {
      const oldProductPrice = String(product.price);
      product.price = Number(oldProductPrice);

      if (oldProductPrice.indexOf(',') > 0) {
        addMessageToToast(t('add_product.decimal_separator_hint'), {
          status: 'error',
          icon: 'alert-triangle',
        });
      }

      if (product.retirementType === 'automatic') {
        delete product.stock;
        product.code = Array.isArray(product.code)
          ? product.code.map((code) => code?.value).filter((code) => code)
          : [];
      } else {
        delete product.code;
      }

      verifyProduct(product);

      await post(`${endpoints.productsUrl}/createNewProduct`, product);
      setState({ ...state, modal: { name: 'success' } });
    } catch (error) {
      addMessageToToast(error.message, { status: 'error', icon: 'alert-triangle' });
      console.error(error);
    }
  };

  const onSelectField = (field: keyof CreateProductModelType, value: any, step: number): void => {
    setValue(field, value);
    setState({ ...state, step });
  };

  return (
    <section className="add-product-content-page">
      <div className="title">{t('add_product.title')}</div>

      <StepAddProduct
        step={state.step}
        maxStep={state.maxStep}
        onClickStep={(value) => setState({ ...state, step: value })}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {state.step === 1 && (
          <SelectPublication onAction={(value) => onSelectField('publicationType', value, 2)} />
        )}

        {state.step === 2 && (
          <SelectProductType
            onAction={(value) => onSelectField('type', value, 3)}
            value={watch('type') as keyof typeof ProductTypeEnum}
          />
        )}

        {state.step === 3 && (
          <SelectProductGame
            value={watch('game')}
            onAction={(value) => onSelectField('game', value, 4)}
          />
        )}

        {state.step === 4 && (
          <ProductDetail
            formController={formController}
            onAction={() => setState({ ...state, step: 5 })}
          />
        )}

        {state.step === 5 && (
          <SelectDeliveryType
            formController={formController}
            onAction={() => setState({ ...state, step: 6 })}
          />
        )}

        {state.step === 6 && <EditPrice formController={formController} />}
      </form>

      <Modal
        open={state.modal.name === 'success'}
        contentClass="success-modal"
        onClose={() => router.push('/dashboard/inventory')}
      >
        <div
          className="image-container"
          style={{
            backgroundImage: madeBackgroundImageUrl('/assets/imgs/product-add-success.webp'),
          }}
        ></div>
        <div className="label">{t('add_product.product_added')}</div>
        <div className="description">
          {t('add_product.pending_approval')}
        </div>
        <Button full onClick={() => router.push('/dashboard/inventory')}>
          {t('add_product.done')}
        </Button>
      </Modal>
    </section>
  );
};
