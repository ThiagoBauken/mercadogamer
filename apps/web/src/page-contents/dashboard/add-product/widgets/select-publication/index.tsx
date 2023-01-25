import { useEffect, useState } from 'react';
import { endpoints, httpGetAll, products } from '@utils';
import { PublicationTypes } from '@utils/product-functions';
import { useTypedSelector } from '@web/store';
import { PublicationTypeCard } from '../publication-type-card';
import { Loading } from '@widgets/loading';

type Props = {
  onAction: (value: keyof typeof products.publicationType) => void;
};

export const SelectPublication: React.FC<Props> = ({ onAction }) => {
  const [state, setState] = useState<{ loading: boolean; hasFree: boolean }>({
    loading: true,
    hasFree: true,
  });
  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  useEffect(() => {
    checkFreeProduct();
  }, []);

  const checkFreeProduct = async (): Promise<void> => {
    try {
      const result = await httpGetAll(endpoints.productsUrl, {
        filter: {
          user: user.id,
          publicationType: 'free',
        },
      });
      
      setState({ loading: false, hasFree: !!result.data.count });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="content select-publication">
      <div className="title">Selecciona un tipo de publicación</div>

      <div className="cards">
        {state.loading ? (
          <Loading loading={true} position="absolute" />
        ) : (
          PublicationTypes.filter((card) => (card.value === 'free' ? !state.hasFree : true)).map(
            (card, index) => <PublicationTypeCard key={index} {...card} onClick={onAction} />
          )
        )}
      </div>
    </div>
  );
};
