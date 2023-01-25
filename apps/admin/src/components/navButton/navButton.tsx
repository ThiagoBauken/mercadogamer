import Link from 'next/link';

interface IProps {
  href: string;
  text: string;
  active?: boolean;
}

export const NavButton: React.FC<IProps> = ({ href, text, active }) => {
  const getClassName = () => {
    return 'nav-link' + (active ? ' nav-link-active' : '');
  };

  return (
    <Link href={href}>
      <a className={getClassName()}>{text}</a>
    </Link>
  );
};
