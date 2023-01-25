import { Card } from '@widgets/card';
import { Expansion } from '@widgets/expansion';

type Props = {
  title: string;
  description: string;
  contentClass?: string;
} & ChildrenProps;

export const EditCard: React.FC<Props> = ({ title, description, contentClass, children }) => {
  return (
    <Card>
      <Expansion
        contentClass={contentClass}
        defaultCollapse
        header={
          <div className="edit-product-card-header">
            <div className="title">{title}</div>
            <div className="description">{description}</div>
          </div>
        }
      >
        {children}
      </Expansion>
    </Card>
  );
};
