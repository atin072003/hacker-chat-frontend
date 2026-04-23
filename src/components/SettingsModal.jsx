import React, { useState } from 'react';
import api from '../services/api';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const SettingsModal = ({ isOpen, onClose }) => {
  const [confirm, setConfirm] = useState('');
  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    if (confirm !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }
    try {
      await api.delete('/users/me');
      toast.success('Account deleted');
      localStorage.removeItem('token');
      dispatch(logout());
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96">
        <h2 className="text-xl text-red-500 font-bold mb-4">Delete Account</h2>
        <p className="text-gray-300 mb-2">Type DELETE to confirm</p>
        <input className="w-full p-2 bg-gray-800 rounded text-white" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-600 p-2 rounded">Cancel</button>
          <button onClick={handleDeleteAccount} className="bg-red-600 p-2 rounded">Delete Forever</button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;