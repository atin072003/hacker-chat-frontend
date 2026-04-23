import React, { useState, useEffect } from 'react';
import { X, Type } from 'lucide-react';

const fonts = ['monospace', 'sans-serif', 'serif', 'Courier New', 'Arial', 'Verdana', 'Georgia'];

const TypingStyleModal = ({ isOpen, onClose }) => {
  const [font, setFont] = useState(localStorage.getItem('chatFont') || 'monospace');
  const [neonGlow, setNeonGlow] = useState(localStorage.getItem('chatGlow') === 'true');

  useEffect(() => {
    document.documentElement.style.setProperty('--chat-font', font);
    localStorage.setItem('chatFont', font);
  }, [font]);

  useEffect(() => {
    if (neonGlow) {
      document.body.classList.add('neon-glow-enabled');
    } else {
      document.body.classList.remove('neon-glow-enabled');
    }
    localStorage.setItem('chatGlow', neonGlow);
  }, [neonGlow]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-green-500 font-bold flex items-center gap-2"><Type className="w-5 h-5" /> Typing Style</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Font Family</label>
          <select value={font} onChange={e => setFont(e.target.value)} className="w-full p-2 bg-gray-800 rounded text-white">
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" checked={neonGlow} onChange={e => setNeonGlow(e.target.checked)} />
            Enable neon glow effect on text
          </label>
        </div>
        <div className="text-white p-2 bg-gray-800 rounded" style={{ fontFamily: font }}>
          Preview: Hello Hacker!
        </div>
      </div>
    </div>
  );
};

export default TypingStyleModal;