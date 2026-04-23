import { createSlice } from '@reduxjs/toolkit';

export const themes = {
  matrix: {
    name: 'Matrix Green',
    primary: '#00ff41',
    secondary: '#00b8ff',
    bg: '#0a0a0a',
    cardBg: 'rgba(0,0,0,0.8)',
    text: '#ffffff',
    border: 'rgba(0,255,65,0.3)',
    neon: true
  },
  neonBlue: {
    name: 'Neon Blue',
    primary: '#00b8ff',
    secondary: '#0066ff',
    bg: '#050b14',
    cardBg: 'rgba(0,20,50,0.8)',
    text: '#e0f0ff',
    border: 'rgba(0,184,255,0.3)',
    neon: true
  },
  amber: {
    name: 'Amber Hacker',
    primary: '#ffaa00',
    secondary: '#ff6600',
    bg: '#1a0a00',
    cardBg: 'rgba(30,15,0,0.8)',
    text: '#fff0d0',
    border: 'rgba(255,170,0,0.3)',
    neon: true
  },
  purple: {
    name: 'Purple Glitch',
    primary: '#bf40ff',
    secondary: '#8a2be2',
    bg: '#0a0510',
    cardBg: 'rgba(30,10,60,0.8)',
    text: '#f0e0ff',
    border: 'rgba(191,64,255,0.3)',
    neon: true
  },
  light: {
    name: 'Light Mode',
    primary: '#2c3e50',
    secondary: '#3498db',
    bg: '#f5f5f5',
    cardBg: 'rgba(255,255,255,0.9)',
    text: '#2c3e50',
    border: 'rgba(0,0,0,0.1)',
    neon: false
  }
};

const initialState = {
  current: localStorage.getItem('theme') || 'matrix',
  themes,
  customTextColor: localStorage.getItem('customTextColor') || null
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.current = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setCustomTextColor: (state, action) => {
      state.customTextColor = action.payload;
      if (action.payload) {
        localStorage.setItem('customTextColor', action.payload);
      } else {
        localStorage.removeItem('customTextColor');
      }
    }
  }
});

export const { setTheme, setCustomTextColor } = themeSlice.actions;
export default themeSlice.reducer;