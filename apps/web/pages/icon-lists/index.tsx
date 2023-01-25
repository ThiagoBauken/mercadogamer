import { NextPage } from 'next';
import { iconList } from '@utils';

import { DefaultLayout } from '@layout/default-layout';
import { Icon } from '@widgets/icon';

const NotFind: NextPage = () => {
  return (
    <DefaultLayout>
      <ul className="icon-list">
        {Object.keys(iconList()).map((key) => (
          <li className="item" key={key}>
            <div className="icon">
              <Icon name={key} />
            </div>
            <div className="name">{key}</div>
          </li>
        ))}
      </ul>
    </DefaultLayout>
  );
};

export default NotFind;
