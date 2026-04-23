import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NewChatModal = ({ isOpen, onClose, onChatCreated }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !search.trim()) {
      setUsers([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/search?q=${search}`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, isOpen]);

  const createChat = async (otherUserId) => {
    try {
      const res = await api.post('/chats', { otherUserId });
      toast.success('Chat created!');
      onChatCreated(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create chat');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="glassmorphism rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-500">New Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-green-500"
            autoFocus
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 py-4">Searching...</div>
          ) : users.length === 0 && search ? (
            <div className="text-center text-gray-400 py-4">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-green-500/10 transition cursor-pointer"
                onClick={() => createChat(user._id)}
              >
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <UserPlus className="w-5 h-5 text-green-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;