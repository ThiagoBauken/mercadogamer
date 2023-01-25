import { useWindowSize } from '@hooks';
import { BreakPoints } from '@theme/breakpoints';
import { Button } from '@widgets/button';
import { Icon } from '@widgets/icon';

type Props = {
  title: string;
  message: string;
  button: string;
  icon: string;
  validate?: boolean;

  onAction?: () => void;
};
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
