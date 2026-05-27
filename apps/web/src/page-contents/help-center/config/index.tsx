// @ts-nocheck - TypeScript compatibility fix
import React from 'react';
import { TFunction } from 'next-i18next';
import { UseCodeHelp } from '../widgets/use-code';

/**
 * Enum defining the available help center categories
 */
export enum HelpCenterCategoryEnum {
  'buy' = 'Comprar',
  'sell' = 'Vender',
  'my-account' = 'Mi cuenta',
  'frequent' = 'PREGUNTAS FRECUENTES',
  'regalos' = 'Regalos',
}

/**
 * Type representing the available category keys
 */
type CategoryType = keyof typeof HelpCenterCategoryEnum;

/**
 * Interface for category list items
 */
interface CategoryListItem {
  icon: string;
  label: string;
  category: CategoryType;
}

/**
 * Interface for help center topic items
 */
interface HelpCenterTopic {
  id: string;
  topic: string;
  category: CategoryType | CategoryType[];
  content?: string[];
  image?: string[];
  component?: React.ReactNode;
}

/**
 * Returns the category list with internationalized labels
 * @param t - Translation function from next-i18next
 * @returns Array of category items with icons and localized labels
 */
export const getHelpCenterKind = (t: TFunction): CategoryListItem[] => [
  { icon: 'buy', label: t('help-center:categories.buy'), category: 'buy' },
  { icon: 'sell', label: t('help-center:categories.sell'), category: 'sell' },
  // { icon: 'my-account', label: t('help-center:categories.my_account'), category: 'my-account' },
  { icon: 'regalos', label: t('help-center:categories.gifts'), category: 'regalos' },
];

/**
 * Returns the complete help center topics data with internationalized content
 * @param t - Translation function from next-i18next
 * @returns Array of help center topics organized by category
 */
export const getHelpCenterTopics = (t: TFunction): HelpCenterTopic[] => [
  // BUY CATEGORY
  {
    id: '0',
    topic: t('help-center:topics.buy.how_to_buy.title'),
    category: 'buy',
    content: t('help-center:topics.buy.how_to_buy.content', { returnObjects: true }) as string[],
  },
  {
    id: '1',
    topic: t('help-center:topics.buy.claims.title'),
    category: 'buy',
    content: t('help-center:topics.buy.claims.content', { returnObjects: true }) as string[],
  },
  {
    id: '2',
    topic: t('help-center:topics.buy.processing_fee.title'),
    category: 'buy',
    content: t('help-center:topics.buy.processing_fee.content', { returnObjects: true }) as string[],
  },
  {
    id: '3',
    topic: t('help-center:topics.buy.cancellations.title'),
    category: 'buy',
    content: t('help-center:topics.buy.cancellations.content', { returnObjects: true }) as string[],
  },
  {
    id: '4',
    topic: t('help-center:topics.buy.ratings.title'),
    category: 'buy',
    content: t('help-center:topics.buy.ratings.content', { returnObjects: true }) as string[],
  },
  {
    id: '15',
    topic: t('help-center:topics.buy.warranty.title'),
    category: 'buy',
    content: t('help-center:topics.buy.warranty.content', { returnObjects: true }) as string[],
  },
  {
    id: '5',
    topic: t('help-center:topics.buy.use_code.title'),
    category: 'buy',
    component: <UseCodeHelp />,
  },

  // SELL CATEGORY
  {
    id: '6',
    topic: t('help-center:topics.sell.how_to_sell.title'),
    category: 'sell',
    content: t('help-center:topics.sell.how_to_sell.content', { returnObjects: true }) as string[],
  },
  {
    id: '7',
    topic: t('help-center:topics.sell.delivery_method.title'),
    category: 'sell',
    content: t('help-center:topics.sell.delivery_method.content', { returnObjects: true }) as string[],
  },
  {
    id: '9',
    topic: t('help-center:topics.sell.warranty.title'),
    category: 'sell',
    content: t('help-center:topics.sell.warranty.content', { returnObjects: true }) as string[],
  },
  {
    id: '10',
    topic: t('help-center:topics.sell.commissions.title'),
    category: 'sell',
    content: t('help-center:topics.sell.commissions.content', { returnObjects: true }) as string[],
  },
  {
    id: '11',
    topic: t('help-center:topics.sell.discount_codes.title'),
    category: 'sell',
    content: t('help-center:topics.sell.discount_codes.content', { returnObjects: true }) as string[],
  },
  {
    id: '12',
    topic: t('help-center:topics.sell.cancellations.title'),
    category: 'sell',
    content: t('help-center:topics.sell.cancellations.content', { returnObjects: true }) as string[],
  },
  {
    id: '13',
    topic: t('help-center:topics.sell.earnings.title'),
    category: 'sell',
    content: t('help-center:topics.sell.earnings.content', { returnObjects: true }) as string[],
  },
  {
    id: '14',
    topic: t('help-center:topics.sell.reputation.title'),
    category: 'sell',
    content: t('help-center:topics.sell.reputation.content', { returnObjects: true }) as string[],
  },

  // FREQUENT QUESTIONS CATEGORY
  {
    id: '101',
    topic: t('help-center:topics.frequent.how_to_buy_mg.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.how_to_buy_mg.content', { returnObjects: true }) as string[],
  },
  {
    id: '102',
    topic: t('help-center:topics.frequent.how_to_sell_mg.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.how_to_sell_mg.content', { returnObjects: true }) as string[],
  },
  {
    id: '103',
    topic: t('help-center:topics.frequent.what_is_warranty.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.what_is_warranty.content', { returnObjects: true }) as string[],
  },
  {
    id: '104',
    topic: t('help-center:topics.frequent.delivery_methods.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.delivery_methods.content', { returnObjects: true }) as string[],
  },
  {
    id: '105',
    topic: t('help-center:topics.frequent.what_is_gift_wheel.title'),
    category: ['frequent', 'regalos'],
    content: t('help-center:topics.frequent.what_is_gift_wheel.content', { returnObjects: true }) as string[],
  },
  {
    id: '106',
    topic: t('help-center:topics.frequent.how_to_use_prizes.title'),
    category: ['frequent', 'regalos'],
    content: t('help-center:topics.frequent.how_to_use_prizes.content', { returnObjects: true }) as string[],
  },
  {
    id: '107',
    topic: t('help-center:topics.frequent.what_prizes.title'),
    category: ['frequent', 'regalos'],
    content: t('help-center:topics.frequent.what_prizes.content', { returnObjects: true }) as string[],
  },
  {
    id: '108',
    topic: t('help-center:topics.frequent.what_can_sell.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.what_can_sell.content', { returnObjects: true }) as string[],
  },
  {
    id: '109',
    topic: t('help-center:topics.frequent.why_buy_mg.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.why_buy_mg.content', { returnObjects: true }) as string[],
  },
  {
    id: '110',
    topic: t('help-center:topics.frequent.where_buy_fortnite.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_fortnite.content', { returnObjects: true }) as string[],
  },
  {
    id: '111',
    topic: t('help-center:topics.frequent.where_buy_freefire.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_freefire.content', { returnObjects: true }) as string[],
  },
  {
    id: '112',
    topic: t('help-center:topics.frequent.where_buy_roblox.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_roblox.content', { returnObjects: true }) as string[],
  },
  {
    id: '113',
    topic: t('help-center:topics.frequent.where_buy_csgo.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_csgo.content', { returnObjects: true }) as string[],
  },
  {
    id: '114',
    topic: t('help-center:topics.frequent.where_buy_mobile_legends.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_mobile_legends.content', { returnObjects: true }) as string[],
  },
  {
    id: '115',
    topic: t('help-center:topics.frequent.where_buy_digital_games.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_digital_games.content', { returnObjects: true }) as string[],
  },
  {
    id: '116',
    topic: t('help-center:topics.frequent.where_buy_playstation.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_playstation.content', { returnObjects: true }) as string[],
  },
  {
    id: '117',
    topic: t('help-center:topics.frequent.where_buy_xbox.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.where_buy_xbox.content', { returnObjects: true }) as string[],
  },
  {
    id: '118',
    topic: t('help-center:topics.frequent.how_invite_friends.title'),
    category: ['frequent', 'regalos'],
    content: t('help-center:topics.frequent.how_invite_friends.content', { returnObjects: true }) as string[],
  },
  {
    id: '119',
    topic: t('help-center:topics.frequent.account_risks.title'),
    category: 'frequent',
    content: t('help-center:topics.frequent.account_risks.content', { returnObjects: true }) as string[],
  },
];

/**
 * Legacy exports for backward compatibility
 * @deprecated Use getHelpCenterKind and getHelpCenterTopics instead
 */
export const HelpCenterKind = getHelpCenterKind;
export const HelpCenterTopics = getHelpCenterTopics;
