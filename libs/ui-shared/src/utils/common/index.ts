import * as icons from '@icons';
import { ThemeColor } from '@theme/color';
import { setting } from '../setting';

export const getDefaultCountry = (): CountryModelType =>
  (typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem(setting.storage.defaultCountry)!)) ||
  {};

export const toUSD = (value: number | string, toFixed = 2): string => {
  const defaultCountry: CountryModelType = getDefaultCountry();
  const _value = Number(value) || 0;
  const toUSD = defaultCountry?.toUSD || 1;
  return (_value / toUSD).toFixed(toFixed);
};

export const undoUSD = (value: number | string): number => {
  const defaultCountry: CountryModelType = getDefaultCountry();
  const _value = typeof value === 'string' ? Number(value) || 0 : value;
  const toUSD = defaultCountry?.toUSD || 1;
  return _value * toUSD;
};

export const toCurrency = (value: string | number, currency = '$') => `${currency}${value}`;

export const toUSDandCurrency = (value: number | string, toFixed = 2, currency = '$') =>
  toCurrency(toUSD(value, toFixed), currency);

export const iconList = (): any => {
  const obj = {};
  Object.keys(icons).forEach((key) => {
    obj[
      key
        .replace(/Icon$/g, '')
        .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
        .join('-')
        .toLocaleLowerCase()
    ] = icons[key];
  });
  return obj;
};

export const EmailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;

export const ProductType: {
  [key in ProductTypeEnum]: { code: string; label: string; icon?: string };
} = {
  game: {
    code: 'game',
    label: 'Juego',
    icon: 'controller',
  },
  giftCard: {
    code: 'giftCard',
    label: 'Gift Card',
    icon: 'shopping-bag',
  },
  item: {
    code: 'item',
    label: 'Item',
    icon: 'knife',
  },
  moneda: {
    code: 'moneda',
    label: 'Moneda',
    icon: 'database',
  },
  pack: {
    code: 'pack',
    label: 'Pack',
    icon: 'archive',
  },
};

export const getFileFullUrl = (path: string): string =>
  `${process.env['NEXT_PUBLIC_FILE_URL']}/${path}`.replace(
    'newadmin.mercadogamer.com',
    'mercadogamer.com'
  );

export const madeBackgroundImageUrl = (...path: string[]): string =>
  path
    .filter((item) => item && !/undefined$/g.test(item))
    .map((item) => `url('${item}')`)
    .join(',');

export const getRandomArrayElements = (arr: Array<any>, n: number): Array<any> => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n >= len) {
    return arr;
  }
  // if (n > len)
  //     throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const products = {
  status: {
    pending: {
      code: 'pending',
      label: 'Pendiente',
    },
    approved: {
      code: 'approved',
      label: 'Aprobado',
    },
    rejected: {
      code: 'rejected',
      label: 'Rechazado',
    },
  },
  type: {
    game: {
      code: 'game',
      label: 'Juego',
    },
    giftCard: {
      code: 'giftCard',
      label: 'Gift Card',
    },
    item: {
      code: 'item',
      label: 'Item',
    },
    coin: {
      code: 'moneda',
      label: 'Moneda',
    },
    pack: {
      code: 'pack',
      label: 'Pack',
    },
    pc: {
      code: 'pc',
      label: 'PC',
    },
    consolas: {
      code: 'consolas',
      label: 'Consolas',
    },
    mobile: {
      code: 'mobile',
      label: 'Mobile',
    },
  },
  types: [
    {
      homeItemFilter: { tipo: ['game'] },
      label: 'Juego',
    },
    {
      homeItemFilter: { tipo: ['giftCard'] },
      label: 'Gift Card',
    },
    {
      homeItemFilter: { tipo: ['item'] },
      label: 'Item',
    },
    {
      homeItemFilter: { tipo: ['moneda'] },
      label: 'Monedas',
    },
    {
      homeItemFilter: { tipo: ['pack'] },
      label: 'Packs',
    },
    {
      homeItemFilter: {
        plataforma: ['STEAM', 'EPIC GAMES', 'BATTLE NET', 'Origin', 'Riot Games'],
      },
      label: 'PC',
    },
    {
      homeItemFilter: {
        plataforma: ['PLAY STATION', 'NINTENDO', 'XBOX'],
      },
      label: 'Consolas',
    },
    {
      homeItemFilter: {
        plataforma: ['Mobile'],
      },
      label: 'Mobile',
    },
  ],
  publicationType: {
    normal: { iva: 21, commission: 7 },
    pro: { iva: 21, commission: 10 },
    free: { iva: 0, commission: 0 },
  },
};

export const OrderSetting: {
  state: { [key: string]: { label: string; color: string; icon?: string; background?: string } };
} = {
  state: {
    pending: {
      label: 'En Proceso',
      color: ThemeColor['gray-60'],
      background: 'rgba(115, 119, 138, 0.15);',
      icon: 'clock',
    },
    cancelled: {
      label: 'Cancelado',
      color: ThemeColor.negative,
      background: 'rgba(255, 45, 45, 0.1)',
      icon: 'close',
    },
    finished: {
      label: 'Finalizado',
      color: ThemeColor.finished,
      background: '#19241E',
      icon: 'check-circle',
    },
    returned: {
      label: 'Reclamo',
      color: ThemeColor.complaint,
      icon: 'alert-triangle',
    },
    paid: {
      label: 'En proceso',
      color: ThemeColor['gray-60'],
      background: 'rgba(115, 119, 138, 0.15);',
      icon: 'clock',
    },
    complaint: {
      label: 'Reclamo',
      color: ThemeColor.complaint,
      background: '#261F1C',
      icon: 'alert-triangle',
    },
  },
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
  return navigator.clipboard && (await navigator.clipboard.writeText(text));
};

export const defaultPagination: PaginatedResponseType = {
  count: 1,
  data: [],
  itemsPerPage: 20,
  page: 1,
  pages: 1,
};

export const OrderStatus: {
  [key in keyof typeof OrderModelStatusEnum]: { label: string; color: string };
} = {
  cancelled: { label: 'Cancelado', color: ThemeColor.negative },
  complaint: { label: 'Reclamo', color: ThemeColor.complaint },
  finished: { label: 'Finalizado', color: ThemeColor.finished },
  returned: { label: 'Reclamo', color: ThemeColor.primary },
  paid: { label: 'En proceso', color: ThemeColor['gray-60'] },
  pending: { label: 'En proceso', color: ThemeColor['gray-60'] },
};

export const LoadsStatus: {
  [key in keyof typeof WithDrawalStatusEnum]: { label: string; color: string };
} = {
  paid: { label: 'check-circle', color: ThemeColor.finished },
  cancelled: { label: 'close', color: ThemeColor.negative },
  pending: { label: 'clock', color: ThemeColor['gray-60'] },
};

export const caculateTime = (
  value: number
): { days: number; hours: number; minuts: number; seconds: number } => {
  let duration = Math.abs(value);
  const days = Math.floor(duration / 86400000);
  duration -= days * 86400000;
  const hours = Math.floor(duration / 3600000);
  duration -= hours * 3600000;
  const minuts = Math.floor(duration / 60000);
  duration -= minuts * 60000;
  const seconds = Math.floor(duration / 1000);
  return { days, hours, minuts, seconds };
};

export const formatInteger = (value: number, length = 2): string => {
  const zero = new Array(length - `${value}`.length).fill(0);
  return zero.concat(value).join('');
};

export const RankingLevel = (
  count: number
): { level: 'bronze' | 'silver' | 'gold' | 'platinum'; label: string; icon: string } => {
  if (count >= 0 && count <= 5) {
    return { level: 'bronze', label: 'Bronce', icon: '/assets/imgs/rate/Bronze.webp' };
  } else if (count <= 50) {
    return { level: 'silver', label: 'Plata', icon: '/assets/imgs/rate/silver.webp' };
  } else if (count <= 150) {
    return { level: 'gold', label: 'Oro', icon: '/assets/imgs/rate/gold.webp' };
  } else {
    return { level: 'platinum', label: 'Platino', icon: '/assets/imgs/rate/platinum.webp' };
  }
};
