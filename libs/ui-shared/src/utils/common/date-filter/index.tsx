export function getDateParam(value: string) {
  switch (value) {
    case '7-days':
      return Date.now() - 6.048e8;

    case '14-days':
      return Date.now() - 1.21e9;

    case '30-days':
      return Date.now() - 2.592e9;

    case 'all-time':
      return 0;

    case 'this-year':
      return new Date(new Date().getFullYear(), 0, 1).getTime();

    default:
      return Date.now() - 2.592e9;
  }
}

export const dateOptions = [
  {
    label: '7 dias',
    value: '7-days',
  },
  {
    label: '14 dias',
    value: '14-days',
  },
  {
    label: '30 dias',
    value: '30-day',
  },
  {
    label: 'Este año',
    value: 'this-year',
  },
  {
    label: 'Todo el tiempo',
    value: 'all-time',
  },
];
