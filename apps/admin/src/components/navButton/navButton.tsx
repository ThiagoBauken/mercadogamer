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
    // Next 14+: <Link> renderiza <a> automaticamente — não envolver outro <a>
    <Link href={href} className={getClassName()}>
      {text}
    </Link>
  );
};
