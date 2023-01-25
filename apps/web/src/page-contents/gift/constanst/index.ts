import { ThemeColor } from '@theme/color';

export const RouletteKind: {
  key: string;
  color?: string;
  label?: string;
  image?: string;
  value?: number;
}[] = [
  {
    key: '50',
    label: '$50',
    color: '#73778A',
    image: '/assets/imgs/illustration/coins/one.webp',
    value: 50,
  },
  {
    key: '0',
    label: 'VACÍO',
    color: '#73778A',
    image: '/assets/imgs/illustration/coins/vacio.webp',
    value: 0,
  },
  {
    key: '25',
    label: '$25',
    color: '#73778A',
    image: '/assets/imgs/illustration/coins/one.webp',
    value: 25,
  },
  {
    key: '500',
    label: '$500',
    image: '/assets/imgs/illustration/coins/few.webp',
    color: '#1774FF',
    value: 500,
  },
  {
    key: '250',
    label: '$250',
    image: '/assets/imgs/illustration/coins/two.webp',
    color: '#8D91A0',
    value: 250,
  },
  {
    key: '1000',
    label: '$1000',
    image: '/assets/imgs/illustration/coins/many.webp',
    color: '#712FFF',
    value: 1000,
  },
  {
    key: '100',
    label: '$100',
    image: '/assets/imgs/illustration/coins/two.webp',
    color: '#8D91A0',
    value: 100,
  },
];
