import { TFunction } from 'next-i18next';

export interface NavItem {
  label: string;
  icon: string | React.ReactNode;
  url: string;
}

export interface NavigationSection {
  title: string;
  items: NavItem[];
}

/**
 * Returns navigation configuration with translated labels
 * @param t - Translation function from useTranslation hook
 * @returns Navigation sections with translated labels
 */
export const getNavigations = (t: TFunction): { [key: string]: NavItem[] } => {
  return {
    [t('nav.balance_section')]: [
      { label: t('nav.balance'), icon: 'account-balance-wallet', url: '/dashboard/balance' }
    ],
    [t('nav.purchases_section')]: [
      { label: t('nav.purchases'), icon: 'account-shopping', url: '/dashboard/order' },
      { label: t('nav.my_questions'), icon: 'help-circle', url: '/dashboard/qas' },
      // { label: t('nav.coupons'), icon: 'cupon', url: '/ticket' },
    ],
    [t('nav.sales_section')]: [
      { label: t('nav.sales'), icon: 'nav-tag', url: '/dashboard/sale' },
      { label: t('nav.products'), icon: 'archive', url: '/dashboard/inventory' },
      { label: t('nav.questions'), icon: 'help-circle', url: '/dashboard/question' },
      { label: t('nav.store'), icon: 'store', url: '/dashboard/store' },
    ],
    [t('nav.settings_section')]: [
      { label: t('nav.my_profile'), icon: 'user', url: '/dashboard/profile' },
      { label: t('nav.kyc'), icon: 'shield-check', url: '/dashboard/kyc' },
      { label: t('nav.disputes'), icon: 'flag', url: '/dashboard/disputas' },
      { label: t('nav.support'), icon: 'message-sequare', url: '/dashboard/support' },
      // { label: t('nav.security'), icon: 'shield-check', url: '/security' },
      // { label: t('nav.notifications'), icon: 'bell', url: '/notification' },
    ],
  };
};
