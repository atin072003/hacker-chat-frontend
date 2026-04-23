import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Copy, Edit, Trash2, Reply, Smile, File } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const MessageBubble = ({ message, isOwn, onReact, onEdit, onDelete, onReply }) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isImage = message.type === 'image';
  const isFile = message.type === 'file';
  const isVoice = message.type === 'voice';
  
  // Safely decode content: if deleted, show placeholder; else decode base64 if it's text and not already decoded
  let content = '';
  if (message.deletedForEveryone) {
    content = <span className="text-gray-500 italic">This message was deleted</span>;
  } else if (message.type === 'text') {
    // Only decode if encryptedContent is a valid base64 string
    const raw = message.encryptedContent;
    if (raw && typeof raw === 'string' && raw.trim() !== '') {
      try {
        content = atob(raw);
      } catch (e) {
        console.warn('Failed to decode message:', raw);
        content = '[Decoding error]';
      }
    } else {
      content = '';
    }
  } else if (message.type === 'image' && message.metadata?.fileUrl) {
    content = <img src={message.metadata.fileUrl} alt="shared" className="max-w-full rounded-lg max-h-60 object-cover" />;
  } else if (message.type === 'file' && message.metadata?.fileUrl) {
    content = <a href={message.metadata.fileUrl} download className="text-green-400 underline flex items-center gap-1"><File size={16} /> Download file</a>;
  } else if (message.type === 'voice' && message.metadata?.fileUrl) {
    content = <audio src={message.metadata.fileUrl} controls className="w-40 h-8" />;
  } else {
    content = message.encryptedContent || ''; // fallback
  }

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(message._id, btoa(editText));
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(message._id);
    setShowDeleteConfirm(false);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group mb-2`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`relative max-w-[70%] rounded-2xl p-3 border backdrop-blur-sm ${
          isOwn ? 'bg-green-500/20 border-green-500' : 'bg-gray-800 border-gray-700'
        }`}
      >
        {!isOwn && !message.deletedForEveryone && message.type === 'text' && (
          <p className="text-xs text-green-400 mb-1">{message.sender}</p>
        )}

        {message.replyTo && !message.deletedForEveryone && (
          <div className="text-xs text-gray-400 border-l-2 border-green-500 pl-2 mb-1">
            ↳ Replying to {message.replyTo.sender || 'message'}
          </div>
        )}

        {!message.deletedForEveryone && (
          <>
            {(message.type === 'image' && message.metadata?.fileUrl) ||
            (message.type === 'file' && message.metadata?.fileUrl) ||
            (message.type === 'voice' && message.metadata?.fileUrl) ? (
              content
            ) : isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 bg-black/50 border border-green-500/30 rounded px-2 py-1 text-white"
                  autoFocus
                />
                <button onClick={handleEditSubmit} className="text-green-500">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-gray-500">Cancel</button>
              </div>
            ) : (
              <p className="message-text break-words">{content}</p>
            )}
          </>
        )}

        <div className="flex justify-between items-center mt-1 gap-2">
          <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
          {isOwn && !message.deletedForEveryone && (
            <span title={message.readBy?.length > 0 ? 'Seen' : 'Delivered'}>
              {message.readBy?.length > 0 ? (
                <CheckCheck className="w-4 h-4 text-green-500" />
              ) : message.deliveredTo?.length > 0 ? (
                <CheckCheck className="w-4 h-4 text-gray-400" />
              ) : (
                <Check className="w-4 h-4 text-gray-600" />
              )}
            </span>
          )}
        </div>

        {message.reactions && message.reactions.length > 0 && !message.deletedForEveryone && (
          <div className="absolute -bottom-4 left-2 flex space-x-1">
            {message.reactions.map((r, idx) => (
              <span key={idx} className="bg-gray-800 rounded-full px-2 py-0.5 text-xs border border-green-500/30">
                {r.emoji}
              </span>
            ))}
          </div>
        )}

        <AnimatePresence>
          {showActions && !message.deletedForEveryone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-10 right-0 bg-gray-900 rounded-lg shadow-lg flex space-x-1 p-1 border border-green-500/30 z-10"
            >
              {message.type === 'text' && (
                <button onClick={() => { navigator.clipboard.writeText(content); }} className="p-1.5 hover:bg-green-500/20 rounded" title="Copy">
                  <Copy className="w-3.5 h-3.5 text-green-500" />
                </button>
              )}
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 hover:bg-green-500/20 rounded" title="React">
                <Smile className="w-3.5 h-3.5 text-green-500" />
              </button>
              {!isOwn && (
                <button onClick={() => onReply(message)} className="p-1.5 hover:bg-green-500/20 rounded" title="Reply">
                  <Reply className="w-3.5 h-3.5 text-green-500" />
                </button>
              )}
              {isOwn && (
                <>
                  {message.type === 'text' && (
                    <button onClick={() => { setIsEditing(true); setEditText(content); }} className="p-1.5 hover:bg-green-500/20 rounded" title="Edit">
                      <Edit className="w-3.5 h-3.5 text-green-500" />
                    </button>
                  )}
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-1.5 hover:bg-red-500/20 rounded" title="Delete for everyone">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showEmojiPicker && (
          <div className="absolute bottom-10 right-0 z-50">
            <EmojiPicker onEmojiClick={(emoji) => { onReact(emoji.emoji); setShowEmojiPicker(false); }} />
          </div>
        )}

        {showDeleteConfirm && (
          <div className="absolute bottom-10 right-0 bg-gray-800 p-2 rounded shadow-lg z-50 flex gap-2">
            <span className="text-sm text-white">Delete for everyone?</span>
            <button onClick={handleDeleteConfirm} className="text-red-500 text-sm">Yes</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400 text-sm">No</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;