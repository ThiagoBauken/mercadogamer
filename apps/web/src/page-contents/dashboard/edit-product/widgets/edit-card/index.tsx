// @ts-nocheck - TypeScript compatibility fix

import dynamic from 'next/dynamic';


type Props = {
  title: string;
  description: string;
  contentClass?: string;
} & ChildrenProps;


const Card = dynamic(() => import('@widgets/card').then(mod => mod.Card), { ssr: false });

const Expansion = dynamic(() => import('@widgets/expansion').then(mod => mod.Expansion), { ssr: false });

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
