import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { addMessage, updateMessageReactions, deleteMessage, updateMessageReadBy } from '../store/slices/chatSlice';
import { setOnlineUsers } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (!token) return;
    socket.current = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.current.on('connect', () => console.log('✅ Socket connected'));
    socket.current.on('new-message', (msg) => dispatch(addMessage(msg)));
    socket.current.on('user-status', ({ userId, status }) => dispatch(setOnlineUsers({ userId, status })));
    socket.current.on('user-typing', ({ userId, isTyping }) => dispatch(updateTyping({ userId, isTyping })));
    socket.current.on('message-read', ({ messageId, userId }) => dispatch(updateMessageReadBy({ messageId, userId })));
    socket.current.on('reaction-updated', ({ messageId, reactions }) => dispatch(updateMessageReactions({ messageId, reactions })));
    socket.current.on('message-edited', ({ messageId, encryptedContent }) => {
      // optional: implement edit in store
    });
    socket.current.on('message-deleted', ({ messageId, chatId }) => dispatch(deleteMessage({ messageId, chatId })));
    socket.current.on('connect_error', (err) => toast.error('Socket error'));

    return () => socket.current?.disconnect();
  }, [token, dispatch]);

  const sendMessage = (data) => socket.current?.emit('send-message', data);
  const sendTyping = (chatId, isTyping) => socket.current?.emit('typing', { chatId, isTyping });
  const markAsRead = (chatId, messageId) => socket.current?.emit('mark-read', { chatId, messageId });
  const addReaction = (messageId, emoji) => socket.current?.emit('add-reaction', { messageId, emoji });
  const editMessage = (messageId, newEncryptedContent) => socket.current?.emit('edit-message', { messageId, newEncryptedContent });
  const deleteMessageSocket = (messageId) => socket.current?.emit('delete-message', { messageId });

  return { sendMessage, sendTyping, markAsRead, addReaction, editMessage, deleteMessage: deleteMessageSocket };
};