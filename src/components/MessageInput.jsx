import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import api from '../services/api';
import toast from 'react-hot-toast';

const MessageInput = ({ onSend, onTyping, chatId }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSend = async () => {
    if (message.trim()) {
      onSend(btoa(message), 'text');
      setMessage('');
    } else if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.post('/chats/upload', formData);
        onSend(res.data.fileUrl, res.data.type);
        setFile(null);
      } catch (err) {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onTyping?.(true);
    }
  };

  const handleBlur = () => onTyping?.(false);

  const handleVoiceSend = (fileUrl, type) => {
    onSend(fileUrl, type);
  };

  return (
    <div className="flex items-center gap-2 p-4 glassmorphism border-t border-green-500/20">
      <label className="cursor-pointer text-green-500 hover:text-green-400">
        <Paperclip className="w-5 h-5" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
      </label>
      <VoiceRecorder onSend={handleVoiceSend} />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        placeholder="Type a message..."
        className="flex-1 bg-black/50 border border-green-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 hacker-input"
      />
      <button
        onClick={handleSend}
        disabled={uploading}
        className="bg-green-500/20 hover:bg-green-500/30 p-2 rounded-lg transition disabled:opacity-50"
      >
        <Send className="w-5 h-5 text-green-500" />
      </button>
    </div>
  );
};

export default MessageInput;