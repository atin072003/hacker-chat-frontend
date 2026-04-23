import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { addMessage, updateMessageReactions, deleteMessage, updateMessageReadBy, updateTyping } from '../store/slices/chatSlice';
import { setOnlineUsers } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    // Force secure long polling (works everywhere)
    socket.current = io('https://hacker-chat-backend.onrender.com', {
      auth: { token },
      transports: ['polling'],
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.current.on('connect', () => {
      console.log('✅ Socket connected via secure polling');
    });

    socket.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      toast.error('Connection lost, reconnecting...');
    });

    socket.current.on('new-message', (msg) => dispatch(addMessage(msg)));
    socket.current.on('user-status', ({ userId, status }) => dispatch(setOnlineUsers({ userId, status })));
    socket.current.on('user-typing', ({ userId, isTyping }) => dispatch(updateTyping({ userId, isTyping })));
    socket.current.on('message-read', ({ messageId, userId }) => dispatch(updateMessageReadBy({ messageId, userId })));
    socket.current.on('reaction-updated', ({ messageId, reactions }) => dispatch(updateMessageReactions({ messageId, reactions })));
    socket.current.on('message-deleted', ({ messageId, chatId }) => dispatch(deleteMessage({ messageId, chatId })));

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [token, dispatch]);

  const sendMessage = (data) => socket.current?.emit('send-message', data);
  const sendTyping = (chatId, isTyping) => socket.current?.emit('typing', { chatId, isTyping });
  const markAsRead = (chatId, messageId) => socket.current?.emit('mark-read', { chatId, messageId });
  const addReaction = (messageId, emoji) => socket.current?.emit('add-reaction', { messageId, emoji });
  const editMessage = (messageId, newEncryptedContent) => socket.current?.emit('edit-message', { messageId, newEncryptedContent });
  const deleteMessageSocket = (messageId) => socket.current?.emit('delete-message', { messageId });

  return { sendMessage, sendTyping, markAsRead, addReaction, editMessage, deleteMessage: deleteMessageSocket };
};