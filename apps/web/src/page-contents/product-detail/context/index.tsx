import { useReducer, createContext } from 'react';
import { INIT_STATE, productDetailReducer } from './reducer';
import { PRODUCTDETAILTYPES } from './type';

export const ProductDetailContext = createContext<
  Partial<{
    state: typeof INIT_STATE;
    actions: {
      setProduct: (product: ProductModelType) => void;
      setLoading: (loading: boolean) => void;
      setValue: (obj: any) => void;
    };
  }>
>({});

export const ProductDetailProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productDetailReducer, INIT_STATE);
  const setProduct = (product: ProductModelType): void => {
    dispatch({
      type: PRODUCTDETAILTYPES.SET_PRODUCT,
      payload: product,
    });
  };
  const setLoading = (loading: boolean): void => {
    dispatch({
      type: PRODUCTDETAILTYPES.SET_LOADING,
      payload: loading,
    });
  };
  const setValue = (obj: any): void => {
    dispatch({
      type: PRODUCTDETAILTYPES.SET_VALUE,
      payload: obj,
    });
  };

  const actions = {
    setProduct,
    setLoading,
    setValue,
  };

  return (
    <ProductDetailContext.Provider value={{ state, actions }}>
      {children}
    </ProductDetailContext.Provider>
  );
};
