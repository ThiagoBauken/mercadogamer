import { getFileFullUrl, madeBackgroundImageUrl } from '@utils';
import { Modal } from '@widgets/modal';
type Props = {
  url: string;
  onClose: () => void;
};
const OpenImageModal: React.FC<Props> = (props) => {
  return (
    <Modal open contentClass="open-image-modal" onClose={props.onClose} width={1000}>
      <div
        className="image"
        style={{
          backgroundImage: madeBackgroundImageUrl(getFileFullUrl(props.url)),
        }}
      ></div>
    </Modal>
  );
};

export default OpenImageModal;
