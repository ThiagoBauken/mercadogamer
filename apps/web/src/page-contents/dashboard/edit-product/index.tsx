import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ThemeColor } from '@theme/color';

import { EditCard } from './widgets';
import {
  addMessageToToast,
  endpoints,
  get,
  getFileFullUrl,
  madeBackgroundImageUrl,
  postFile,
  ProductFunctions,
  ProductType,
  put,
  toUSD,
  toUSDandCurrency,
  httpGetAll,
} from '@utils';
import { getCategories, getPlatforms, useAppDispatch, useTypedSelector } from '@store';
import { getGames } from 'apps/web/src/store/actions/game';
import { useRouter } from 'next/router';
import { OtherSelectGame } from '../add-product/widgets';
import { Button } from '@widgets/button';
import { InformationBadge } from '@widgets/information-badge';
import { Radiobox } from '@widgets/radiobox';
import { FormInput, FormMultipleSelect, FormSelect, FormTextarea } from '@widgets/form';
import { WrapLabel } from '@widgets/wrap-label';
import { FileSelector } from '@widgets/file-selector';
import { IconButton } from '@widgets/icon-button';
import { Icon } from '@widgets/icon';
import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { Loading } from '@widgets/loading';
import { verifyProduct } from '@utils/product-functions/index';
import { continents } from '@ui-shared/utils';

export const EditProductPageContent: React.FC = () => {
  const router = useRouter();

  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  const [type, setCheck] = useState<{ loading: boolean; hasFree: boolean }>({
    loading: true,
    hasFree: true,
  });

  const { width } = useWindowSize();

  const dispatch = useAppDispatch();
  const {
    game: { games },
    platform: { platforms },
    category: { categories },
  } = useTypedSelector((store) => store);

  const [state, setState] = useState<{ file: File; modal: boolean }>({ file: null, modal: false });

  const { control, watch, handleSubmit, setValue, reset } = useForm<CreateProductModelType>({});

  const [formStock, setFormStock] = useState<string>('0');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'code', // unique name for your Field Array
  });

  console.log({
    fields,
  });
  const [product, setProduct] = useState<ProductModelType>(null);

  useEffect(() => {
    checkFreeProduct();
  }, []);

  useEffect(() => {
    initData();
  }, []);
  useEffect(() => {
    router.query.id && loadProduct();
  }, [router]);

  useEffect(() => {
    state.file && uploadFile();
  }, [state.file]);

  useEffect(() => {
    const data = ProductFunctions.caculateCommission(watch('price'), watch('publicationType'));
    Object.keys(data).forEach((key) => setValue(key as keyof CreateProductModelType, data[key]));
  }, [watch('price'), watch('publicationType')]);

  const initData = async (): Promise<void> => {
    try {
      dispatch(getGames());
      dispatch(getPlatforms());
      dispatch(getCategories());
    } catch (error) {
      console.log(error);
    }
  };

  const loadProduct = async (): Promise<void> => {
    try {
      const response = await get(`${endpoints.productsUrl}/${router.query.id}`);

      const product: ProductModelType = response.data.data;
      setProduct(response.data.data);
      setFormStock(String(response.data.data.stock));
      reset({
        ...product,
        platform: product.platform as string,
        category: product.category as string,
        game: product.game as string,
        user: (product.user || '') as string,
        stockProduct: null,
        code: Array.isArray(product.stockProduct)
          ? product.stockProduct.map((item) => ({ value: item.code }))
          : '',
        retirementType:
          Array.isArray(product.stockProduct) && product.stockProduct?.length
            ? product.stockProduct[0].retirementType
            : 'automatic',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (product: CreateProductModelType): Promise<void> => {
    try {
      verifyProduct(product);
      if (product.retirementType === 'automatic') {
        delete product.stock;
        product.code = Array.isArray(product.code)
          ? product.code.map((code) => code?.value).filter((code) => code)
          : [];
      } else {
        delete product.code;
      }

      try {
        await put(`${endpoints.productsUrl}/${router.query.id}`, product);
        addMessageToToast('¡Producto actualizado con éxito!', {
          status: 'success',
          icon: 'check-circle',
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      addMessageToToast(error.message, { status: 'error', icon: 'alert-triangle' });
    }
  };

  const uploadFile = async (): Promise<void> => {
    if (!state.file) return;
    try {
      const response = await postFile(state.file);
      setValue('picture', response.data.data?.file);
    } catch (error) {
      console.log(error);
    }
  };

  const checkFreeProduct = async (): Promise<void> => {
    try {
      const result = await httpGetAll(endpoints.productsUrl, {
        filter: {
          user: user.id,
          publicationType: 'free',
        },
      });
      setCheck({ loading: false, hasFree: !!result.data.count });
    } catch (error) {
      console.log(error);
    }
  };

  const VerPublicacionButton = () => (
    <Button onClick={() => router.push('/product-detail/' + product.id)} kind="secondary">
      Ver publicación
    </Button>
  );

  return (
    <section className="edit-product-page-content">
      <div className="title">
        <div className="subject">Editar producto</div>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '5px' }}>
            <VerPublicacionButton />
          </div>
          <Button
            onClick={() =>
              (document.querySelector('button[type=submit]') as HTMLButtonElement).click()
            }
            full={width < BreakPoints.lg}
          >
            Guardar
          </Button>
        </div>
      </div>

      <div className="description">{product?.name}</div>

      <div className="information">
        <InformationBadge
          icon={
            product?.status === 'approved'
              ? 'check-circle'
              : product?.status === 'rejected'
              ? 'close'
              : 'alert-triangle'
          }
          color={
            product?.status === 'approved'
              ? ThemeColor.positive
              : product?.status === 'rejected'
              ? ThemeColor.negative
              : ThemeColor.pending
          }
        >
          {product?.status === 'approved'
            ? 'Publicado'
            : product?.status === 'rejected'
            ? 'Rechazado'
            : 'Pendiente'}
        </InformationBadge>

        <InformationBadge icon="nav-tag" color={ThemeColor.blue}>
          {product?.sold} ventas
        </InformationBadge>
      </div>

      <div className="rejected-message">
        {product?.status === 'rejected' && (
          <div className="title">
            Este producto se encuentra rechazado por los siguientes motivos:
          </div>
        )}
        {product?.status === 'rejected' &&
          product?.rejectedmessages?.map((item, index) => (
            <div className="content" key={index}>
              <Icon name="circle-close" />
              <span>{item.body}</span>
            </div>
          ))}
      </div>

      <form
        id="productForm"
        className="content"
        onSubmit={handleSubmit(onSubmit)}
        onKeyUp={(event) => event.preventDefault()}
      >
        <EditCard
          title="Tipo de publicación"
          description={
            ProductFunctions.PublicationTypes.find(
              (publicationType) => publicationType.value === watch('publicationType')
            )?.label
          }
        >
          {type.loading ? (
            <Loading loading={true} position="absolute" />
          ) : (
            ProductFunctions.PublicationTypes.filter((card) =>
              card.value === 'free' ? !type.hasFree : true
            ).map((publicationType) => (
              <Radiobox
                key={publicationType.value}
                checked={watch('publicationType') === publicationType.value}
                className={watch('publicationType') === publicationType.value ? 'active' : ''}
                onChange={() => setValue('publicationType', publicationType.value)}
              >
                {publicationType.label}
                <span>{publicationType.description}</span>
              </Radiobox>
            ))
          )}
        </EditCard>

        <EditCard title="Tipo de producto" description={ProductType[watch('type')]?.label}>
          {Object.keys(ProductType).map((key) => (
            <Radiobox
              key={key}
              checked={watch('type') === key}
              className={watch('type') === key ? 'active' : ''}
              onChange={() => setValue('type', key)}
            >
              {ProductType[key].label}
            </Radiobox>
          ))}
        </EditCard>

        <EditCard title="Juego" description={games.find((item) => item.id === watch('game'))?.name}>
          {games.map((game) => (
            <Radiobox
              key={game.id}
              checked={watch('game') === game.id}
              className={watch('game') === game.id ? 'active' : ''}
              onChange={() => setValue('game', game.id)}
            >
              {game.name}
            </Radiobox>
          ))}
          <Radiobox checked={false} onChange={() => setState({ ...state, modal: true })}>
            Otro juego
          </Radiobox>
          <Radiobox checked={!watch('game')} onChange={() => setValue('game', undefined)}>
            Ningún juego
          </Radiobox>
        </EditCard>

        <EditCard
          title="Detalles"
          description="Completaste todos los detalles"
          contentClass="edit-detail"
        >
          <FormInput control={control} name="name" label="Título de la publicación" full />
          <FormTextarea control={control} name="description" label="Descripción" full />
          <WrapLabel label="Agregar imagen" width="100%">
            <FileSelector
              disableMessage
              disableReset
              onChange={(value) => setState({ ...state, file: value })}
              width="100%"
              renderButton={
                <div className="upload-file">
                  <div
                    className="image-container"
                    style={{
                      backgroundImage: madeBackgroundImageUrl(
                        watch('picture')
                          ? getFileFullUrl(watch('picture'))
                          : '/assets/imgs/placeholder.svg'
                      ),
                    }}
                  ></div>
                </div>
              }
            ></FileSelector>
          </WrapLabel>
          <div className="row">
            <FormSelect
              full
              multiple
              control={control}
              name="platform"
              label="Plataforma"
              placeholder="Plataforma"
              items={platforms.map((item) => ({ label: item.name, value: item.id }))}
            />

            <FormSelect
              full
              control={control}
              name="category"
              label="Categoría"
              placeholder="Categoría"
              items={categories.map((item) => ({ label: item.name, value: item.id }))}
            />
          </div>

          <FormMultipleSelect
            full
            control={control}
            name="countries"
            label="Disponibilidad geográfica"
            placeholder="Países"
            items={continents.map((item) => ({
              label: item.label,
              value: item.value,
              items: item.countries,
            }))}
            multiple
          />
        </EditCard>

        <EditCard
          title="Entrega"
          description={watch('retirementType') == 'automatic' ? 'Automática' : 'Coordinada'}
          contentClass="edit-delivery"
        >
          <Radiobox
            checked={watch('retirementType') === 'automatic'}
            onChange={() => setValue('retirementType', 'automatic')}
          >
            Entrega automática
          </Radiobox>
          {watch('retirementType') === 'automatic' && (
            <React.Fragment>
              <div className="description">
                El comprador recibirá el código del producto automáticamente después de realizar la
                compra. El dinero se acreditará en tu balance una vez que el comprador finalice la
                transacción o en un plazo máximo de 2 días.
              </div>
              <WrapLabel label="Clave del producto" className="edit-code" width="100%">
                {fields?.map((field, index) => (
                  <div className="record" key={field.id}>
                    <FormInput
                      control={control}
                      name={`code.${index}.value`}
                      placeholder="Nombre"
                      full
                    />
                    <IconButton
                      icon="close"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                ))}
              </WrapLabel>
              <div className="action" onClick={() => append('')}>
                <div className="icon">
                  <Icon name="plus-circle" />
                </div>
                <div className="label">Agregar</div>
              </div>
            </React.Fragment>
          )}
          <Radiobox
            checked={watch('retirementType') === 'coordinated'}
            onChange={() => setValue('retirementType', 'coordinated')}
          >
            Entrega coordinada
          </Radiobox>
          {watch('retirementType') === 'coordinated' && (
            <React.Fragment>
              <div className="description">
                Una vez que el comprador realice la compra deberás enviar el código del producto a
                través del chat de la venta. El dinero se acreditará en tu balance una vez que el
                comprador finalice la transacción o en un plazo máximo de 2 días.
              </div>
              <FormInput
                value={formStock}
                onChange={(value) => {
                  Number(value) >= 0 ? setFormStock(String(value)) : setFormStock('0');
                }}
                control={control}
                min={0}
                name="stock"
                label="Stock"
                type="number"
                full
              />
            </React.Fragment>
          )}
        </EditCard>

        <EditCard
          title="Precio"
          description={`ARS ${toUSD(watch('price'))}`}
          contentClass="edit-price"
        >
          <FormInput
            control={control}
            name="price"
            full
            prefixNode="$"
            endfixNode={
              <div
                className="flag"
                style={{ backgroundImage: `url(https://flagcdn.com/w40/us.png)` }}
              ></div>
            }
          />

          <div className="product-info">
            <div className="header">
              <div className="label">Recibirás (ARS)</div>
              <div
                className="flag"
                style={{ backgroundImage: `url(https://flagcdn.com/w40/ar.png)` }}
              ></div>
            </div>
            <div className="info">
              <div className="item">
                <div className="label">Conversión</div>
                <div className="value">{toUSDandCurrency(watch('price'))}</div>
              </div>
              <div className="item">
                <div className="label">Comisión {watch('publicationType')}</div>
                <div className="value">{toUSDandCurrency(watch('commission') + watch('iva'))}</div>
              </div>
              <div className="item total">
                <div className="label">Total</div>
                <div className="value">
                  {toUSDandCurrency(watch('price') - watch('commission') - watch('iva'))}
                </div>
              </div>
            </div>
          </div>
        </EditCard>

        <div className="action" style={{ display: 'flex' }}>
          <div style={{ marginRight: '5px' }}>
            <VerPublicacionButton />
          </div>
          <Button type="submit" full={width < BreakPoints.lg}>
            Guardar
          </Button>
        </div>
      </form>

      {state.modal && (
        <OtherSelectGame
          open={state.modal}
          onAction={(value) => {
            setValue('game', value);
            setState({ ...state, modal: false });
          }}
          onClose={() => setState({ ...state, modal: false })}
        />
      )}
    </section>
  );
};
