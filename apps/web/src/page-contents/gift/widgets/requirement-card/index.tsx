// @ts-nocheck - TypeScript compatibility fix
import { useWindowSize } from '@hooks';
import dynamic from 'next/dynamic';
import { BreakPoints } from '@theme/breakpoints';



type Props = {
  title: string;
  message: string;
  button: string;
  icon: string;
  validate?: boolean;

  onAction?: () => void;
};

const Button = dynamic(() => import('@widgets/button').then(mod => mod.Button), { ssr: false });

const Icon = dynamic(() => import('@widgets/icon').then(mod => mod.Icon), { ssr: false });

export const RouletteRequirementCard: React.FC<Props> = ({
  title,
  message,
  button,
  icon,
  validate,
  onAction,
}) => {
  const { width } = useWindowSize();
  return (
    <div className="roulette-requirement-card">
      {width > BreakPoints.lg ? (
        <div className="card">
          <div className="content">
            <div className="title">{title}</div>
            <div className="message">{message}</div>
            <div className="action">
              {validate ? (
                <div className="validated">
                  <div className="icon">
                    <Icon name="check-circle" />
                  </div>
                  <div className="message">Validado</div>
                </div>
              ) : (
                <Button kind="secondary" onClick={onAction}>
                  {button}
                </Button>
              )}
            </div>
          </div>
          <div className="icon">
            <Icon name={icon} />
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="content">
            <div className="title">{title}</div>
            <div className="message">{message}</div>
          </div>
          <div className="mobile-action">
            <div className="action">
              {validate ? (
                <div className="validated">
                  <div className="icon">
                    <Icon name="check-circle" />
                  </div>
                  <div className="message">Validado</div>
                </div>
              ) : (
                <Button kind="secondary" onClick={onAction}>
                  {button}
                </Button>
              )}
            </div>
            <div className="icon">
              <Icon name={icon} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
