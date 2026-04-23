import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomTextColor } from '../store/slices/themeSlice';
import { Type, X } from 'lucide-react';

const TextColorPicker = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { customTextColor } = useSelector(state => state.theme);
  const [tempColor, setTempColor] = useState(customTextColor || '#ffffff');

  const handleSave = () => {
    dispatch(setCustomTextColor(tempColor));
    onClose();
  };

  const handleReset = () => {
    dispatch(setCustomTextColor(null));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="glassmorphism rounded-2xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-green-500 font-bold flex items-center gap-2">
            <Type className="w-5 h-5" /> Text Color
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Pick a color</label>
          <input
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            className="w-full h-10 bg-gray-800 border border-green-500/30 rounded cursor-pointer"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-green-600 py-2 rounded">Apply</button>
          <button onClick={handleReset} className="flex-1 bg-gray-600 py-2 rounded">Reset to theme default</button>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Current text color will be saved and applied across all themes.
        </p>
      </div>
    </div>
  );
};

export default TextColorPicker;