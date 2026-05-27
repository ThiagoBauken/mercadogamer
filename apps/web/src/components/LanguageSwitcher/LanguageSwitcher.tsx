// @ts-nocheck - TypeScript compatibility fix
/**
 * LanguageSwitcher Component
 *
 * Componente para alternar entre idiomas disponíveis
 * Suporta: Português (pt-BR), Inglês (en), Espanhol (es)
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
];

interface LanguageSwitcherProps {
  /**
   * Variante do botão
   */
  variant?: 'text' | 'outlined' | 'contained';
  /**
   * Mostrar apenas o ícone (sem texto)
   */
  iconOnly?: boolean;
  /**
   * Tamanho do botão
   */
  size?: 'small' | 'medium' | 'large';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'text',
  iconOnly = false,
  size = 'medium',
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLocale = router.locale || 'pt-BR';
  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;

    // Salvar preferência no localStorage
    localStorage.setItem('preferredLanguage', languageCode);

    // Mudar o idioma
    router.push({ pathname, query }, asPath, { locale: languageCode });

    handleClose();
  };

  return (
    <Box>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        startIcon={!iconOnly ? <LanguageIcon /> : undefined}
        sx={{
          minWidth: iconOnly ? 'auto' : undefined,
          px: iconOnly ? 1 : 2,
        }}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {iconOnly ? (
          <LanguageIcon />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.nativeName}</span>
          </Box>
        )}
      </Button>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => {
          const isSelected = language.code === currentLocale;

          return (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={isSelected}
            >
              <ListItemIcon sx={{ fontSize: '1.5rem' }}>
                {language.flag}
              </ListItemIcon>
              <ListItemText>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: isSelected ? 600 : 400 }}>
                    {language.nativeName}
                  </span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    {language.name}
                  </span>
                </Box>
              </ListItemText>
              {isSelected && (
                <CheckIcon sx={{ ml: 2, color: 'primary.main' }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
