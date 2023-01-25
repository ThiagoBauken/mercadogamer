import { Button } from '@widgets/button';
import Image from 'next/image';

type Props = {
  devices: DeviceCardModelType;
  onAction?: () => void;
};

const DeviceCard: React.FC<Props> = (props) => {
  const { devices } = props;
  const fileUrl = `${devices.img}`;
  const iconUrl = `${devices.icon}`;

  return (
    <div className="individual-device-card">
      <div
        className="card-background"
        style={{
          backgroundImage: `linear-gradient(90deg, #1B1C23 14.05%, rgba(27, 28, 35, 0) 72.33%), url('${fileUrl}')`,
        }}
      >
        <div className="each-card">
          <Image
            src={iconUrl}
            className="icon"
            width={39}
            height={31}
            loading="lazy"
            unoptimized={true}
            alt="device card"
          />
          <div className="title">{devices.title}</div>
          <div className="content">{devices.content}</div>
          <Button className="button" onClick={props.onAction}>
            {devices.button}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
