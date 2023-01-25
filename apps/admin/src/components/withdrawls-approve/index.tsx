import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { addMessageToToast, endpoints, post, setting } from '@utils';
import { Modal } from '@widgets/modal';
import { FormInput, FormTextarea } from '@widgets/form';
import { Button } from '@widgets/button';
import { Input } from '@widgets/input';
import { useRouter } from 'next/router';

const WithDrawlsApproveModal: React.FC<ModalProps & { onAction: () => void }> = (props) => {
  const router = useRouter();

  const { control, handleSubmit } = useForm<WithDrawalModelType>({});

  const onSubmit = async (accept: WithDrawalModelType): Promise<void> => {
    try {
      // submit accpet requesting to backend
      addMessageToToast('La carga fue aprobada.', {
        status: 'success',
        icon: 'check-circle',
      });
      props.onAction();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal {...props} contentClass="withdrawls-approve-modal" header="Aprobar carga">
      <div className="total-balance">
        El monto especificado por el usuario es <span>$8.000</span>
      </div>
      <div className="edit-price-input">
        <div className="prefix">$</div>
        <FormInput control={control} name="price" full placeholder="0.00" />
      </div>
      <div className="fee" placeholder="0.00">
        -$0
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTextarea
          control={control}
          name="body"
          label="Comentario"
          placeholder="Placeholder"
          full
          rules={{ required: 'Este campo es obligatorio.' }}
        />

        <Button full type="submit">
          Aprobar carga
        </Button>
      </form>
    </Modal>
  );
};

export default WithDrawlsApproveModal;
