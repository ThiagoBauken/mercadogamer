import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { updateUser, useAppDispatch, useTypedSelector } from '@store';
import { ThemeColor } from '@theme/color';
import {
  addMessageToToast,
  endpoints,
  getFileFullUrl,
  httpGetAll,
  madeBackgroundImageUrl,
  postFile,
  put,
} from '@utils';
import { StoreInformationCard } from './widgets';
import Tooltip from '@widgets/tooltip';
import { Icon } from '@widgets/icon';
import { Rating } from '@widgets/rating';
import { FileSelector } from '@widgets/file-selector';
import { Button } from '@widgets/button';
import moment, { relativeTimeRounding } from 'moment';

const CreateTicketModal = dynamic(() => import('../support/widgets/create-ticket-modal/index'));

export const StorePageContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    auth: { user },
  } = useTypedSelector((store) => store);

  const [state, setState] = useState<{ file: File; sales: number; fileUrl: string }>({
    file: null,
    sales: 0,
    fileUrl: '',
  });

  console.log(state.fileUrl);

  useEffect(() => {
    user?.id && loadSales();
  }, [user?.id]);

  useEffect(() => {
    uploadFile();
  }, [state.file]);

  const loadSales = async (): Promise<void> => {
    try {
      const response = await httpGetAll<OrderModelType>(endpoints.orderUrl, {
        filter: { seller: user?.id, status: 'finished' },
      });
      setState({ ...state, sales: response.data.count });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async (): Promise<void> => {
    if (!state.file) return;
    try {
      const response = await postFile(state.file);
      setState({ ...state, fileUrl: response.data.data?.file });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserBanner = async (): Promise<void> => {
    if (state.fileUrl) {
      const userResponse = await put<UserModelType, UserModelType>(endpoints.userUrl, {
        bannerDesktop: state.fileUrl,
      });
      dispatch(updateUser(userResponse.data));

      addMessageToToast('Se han guardado los cambios.', {
        status: 'success',
        icon: 'check-circle',
      });
    }
  };

  const getUserAge = (user: UserModelType): string => {
    const created = moment(user.createdAt);
    const today = moment(new Date());
    const diff = moment.duration(today.diff(created));

    const years = Math.floor(diff.asYears());
    const months = Math.floor(diff.asMonths()) - years * 12;

    let ret = '';

    if (years > 0) {
      ret += years;
      ret += years === 1 ? ' año' : ' años';
    }

    if (months > 0) {
      if (years > 0) {
        ret += ', ';
      }

      ret += months + ' meses';
    }

    return ret;
  };

  return (
    <section className="store-page-content">
      <div className="title">Tienda</div>
      <div className="content">
        <div className="store-information">
          <div className="header">
            <div className="title">Información de tu tienda</div>
            <Tooltip tooltip="Esta información es visible para otros usuarios.">
              <Icon name="exclamation-mark-circle" size={24} color={ThemeColor['gray-70']} />
            </Tooltip>
          </div>

          <div className="content">
            <StoreInformationCard
              icon="profile-star"
              label="Calificación"
              message={
                <div className="qualification">
                  <Rating rating={user?.sellerQualification} activeIcon="star" icon="star" />
                  <div className="rate-score">
                    {Math.round(user?.sellerQualification * 100) / 100}
                  </div>
                </div>
              }
            />

            <StoreInformationCard
              icon="profile-calendar"
              label="Antigüedad"
              message={getUserAge(user)}
            />

            <StoreInformationCard
              icon="profile-cart"
              label="Ventas"
              message={`${state.sales} concretadas`}
            />

            {/* <StoreInformationCard icon="profile-global" label="Ubicación" message={user?.address} /> */}
          </div>
        </div>

        <div className="banner-personalize">
          <div className="title">Banner personalizado</div>
          <div className="content">
            <div className="label">
              Puedes agregar un banner personalizado, será visible en tu perfil de vendedor.
            </div>
            <FileSelector
              disableMessage
              disableReset
              onChange={(value) => setState({ ...state, file: value })}
              renderButton={
                <div
                  className="upload-file"
                  style={{
                    backgroundImage: madeBackgroundImageUrl(
                      getFileFullUrl(state.fileUrl || user?.bannerDesktop)
                    ),
                  }}
                >
                  <div className="icon">
                    <Icon name="upload" />
                  </div>
                  <div className="message">Cargar archivos aquí</div>
                </div>
              }
            ></FileSelector>
          </div>
        </div>

        <div className="action">
          <Button onClick={updateUserBanner}>Guardar</Button>
        </div>
      </div>
    </section>
  );
};
