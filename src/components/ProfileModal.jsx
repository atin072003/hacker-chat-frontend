import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Camera, X } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [statusText, setStatusText] = useState(user?.statusText || '');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    setLoading(true);
    try {
      const res = await api.post('/users/avatar', formData);
      toast.success('Avatar updated');
      onUpdate?.({ avatar: res.data.avatarUrl });
      onClose();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/users/status', { statusText });
      toast.success('Status updated');
      onUpdate?.({ statusText });
      onClose();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-green-500/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-green-500 font-bold">Edit Profile</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="text-center">
          <div className="relative inline-block">
            <img src={previewUrl || '/default-avatar.svg'} className="w-24 h-24 rounded-full object-cover border-2 border-green-500" alt="avatar" />
            <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 cursor-pointer">
              <Camera className="w-4 h-4 text-black" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          {avatarFile && (
            <button onClick={handleUpload} className="mt-2 bg-green-600 px-3 py-1 rounded text-sm" disabled={loading}>
              Upload
            </button>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-gray-300 mb-1">Status</label>
          <input value={statusText} onChange={e => setStatusText(e.target.value)} className="w-full p-2 bg-gray-800 border border-green-500/30 rounded text-white" />
          <button onClick={handleStatusUpdate} className="mt-2 bg-blue-600 px-3 py-1 rounded text-sm" disabled={loading}>
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;