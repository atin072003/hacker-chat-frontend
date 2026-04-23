import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { current, themes, customTextColor } = useSelector(state => state.theme);
  const theme = themes[current];

  useEffect(() => {
    const root = document.documentElement;
    // Apply all theme variables
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'neon') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });
    // Override text color if custom is set
    if (customTextColor) {
      root.style.setProperty('--theme-text', customTextColor);
    } else {
      root.style.setProperty('--theme-text', theme.text);
    }
    // Neon class
    if (theme.neon) {
      document.body.classList.add('neon-enabled');
    } else {
      document.body.classList.remove('neon-enabled');
    }
    document.body.style.backgroundColor = theme.bg;
  }, [theme, customTextColor]);

  return <>{children}</>;
};

export default ThemeProvider;