import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/slices/themeSlice';
import { Palette } from 'lucide-react';

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { current, themes } = useSelector(state => state.theme);

  const themeList = Object.keys(themes).map(key => ({
    id: key,
    name: themes[key].name,
    color: themes[key].primary
  }));

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-green-500 hover:text-green-400">
        <Palette className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 glassmorphism rounded-lg p-2 z-50">
          {themeList.map(t => (
            <button
              key={t.id}
              onClick={() => { dispatch(setTheme(t.id)); setOpen(false); }}
              className={`block w-full text-left px-3 py-1 text-sm rounded ${current === t.id ? 'bg-green-500/20' : 'hover:bg-white/10'}`}
              style={{ color: t.color }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;