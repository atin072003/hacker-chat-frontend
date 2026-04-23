import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { setChats, setActiveChat, setMessages } from '../store/slices/chatSlice';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';
import { Terminal, LogOut, MessageCircle, Users, Plus, Settings, User, Type } from 'lucide-react';
import NewChatModal from '../components/NewChatModal';
import MessageBubble from '../components/MessageBubble';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import MusicPlayer from '../components/MusicPlayer';
import TypingStyleModal from '../components/TypingStyleModal';
import MessageInput from '../components/MessageInput';
import ThemeSwitcher from '../components/ThemeSwitcher';
import TextColorPicker from '../components/TextColorPicker';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chats, activeChat, messages, typingUsers } = useSelector((state) => state.chat);
  const { sendMessage, sendTyping, markAsRead, addReaction, editMessage, deleteMessage } = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTypingStyleOpen, setIsTypingStyleOpen] = useState(false);
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const fallbackAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2300ff41'/%3E%3C/svg%3E";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chats');
        dispatch(setChats(res.data));
      } catch (err) { console.error(err); }
    };
    fetchChats();
  }, [dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await api.get(`/chats/${activeChat._id}/messages`);
        dispatch(setMessages({ chatId: activeChat._id, messages: res.data }));
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeChat, dispatch]);

  useEffect(() => {
    if (activeChat && messages[activeChat._id]?.length) {
      const unread = messages[activeChat._id].filter(
        msg => msg.senderId !== user?.id && !msg.readBy?.includes(user?.id)
      );
      unread.forEach(msg => markAsRead(activeChat._id, msg._id));
    }
  }, [activeChat, messages, user?.id, markAsRead]);

  const handleSendMessage = (encryptedContent, type) => {
    if (!activeChat) return;
    sendMessage({
      chatId: activeChat._id,
      encryptedContent,
      type,
    });
  };

  const handleChatCreated = (newChat) => {
    if (!chats.some(chat => chat._id === newChat._id)) {
      dispatch(setChats([newChat, ...chats]));
    }
    dispatch(setActiveChat(newChat));
  };

  const handleUpdateUser = (updates) => {
    // optional – update auth user state
  };

  return (
    <div className="h-screen flex flex-col md:flex-row cyber-bg">
      {/* Sidebar - responsive */}
      <div className="w-full md:w-80 glassmorphism border-b md:border-r border-green-500/20 flex flex-col z-10">
        <div className="p-4 border-b border-green-500/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-500" />
            <h2 className="text-green-500 font-bold neon-text text-lg md:text-base">Chats</h2>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <ThemeSwitcher />
            <button onClick={() => setIsTextColorOpen(true)} className="text-yellow-500 hover:text-yellow-400">
              <Type className="w-5 h-5" />
            </button>
            <button onClick={() => setIsTypingStyleOpen(true)} className="text-purple-500 hover:text-purple-400">
              <Type className="w-5 h-5" />
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="text-green-500 hover:text-green-400">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="text-red-500 hover:text-red-400">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="text-green-500 hover:text-green-400">
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => { localStorage.removeItem('token'); dispatch(logout()); }} className="text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => dispatch(setActiveChat(chat))}
              className={`p-3 cursor-pointer hover:bg-white/5 transition glitch-hover ${activeChat?._id === chat._id ? 'bg-green-500/10 border-l-4 border-l-green-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center overflow-hidden">
                  {chat.type === 'group' ? (
                    <Users className="w-5 h-5 text-green-500" />
                  ) : (
                    <img
                      src={chat.participants.find(p => p._id !== user?.id)?.avatar || fallbackAvatar}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }}
                      alt="avatar"
                    />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm md:text-base">
                    {chat.type === 'group'
                      ? chat.groupName
                      : chat.participants.find(p => p._id !== user?.id)?.username}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{chat.lastMessage || 'No messages'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="flex-1 flex flex-col h-full">
          <div className="glassmorphism border-b border-green-500/20 p-4">
            <h2 className="text-white font-bold neon-text text-base md:text-lg">
              {activeChat.type === 'group'
                ? activeChat.groupName
                : activeChat.participants.find(p => p._id !== user?.id)?.username}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {(messages[activeChat._id] || []).map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.senderId === user?.id}
                onReact={(emoji) => addReaction(msg._id, emoji)}
                onEdit={(msgId, newEncrypted) => editMessage(msgId, newEncrypted)}
                onDelete={(msgId) => deleteMessage(msgId)}
                onReply={() => {}}
              />
            ))}
            {typingUsers.length > 0 && (
              <div className="text-green-500 text-sm italic">Someone is typing...</div>
            )}
          </div>
          <MessageInput
            onSend={handleSendMessage}
            onTyping={(isTyping) => sendTyping(activeChat?._id, isTyping)}
            chatId={activeChat?._id}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-green-500 opacity-50 mx-auto mb-4" />
            <p className="text-gray-400 text-sm md:text-base">Select a chat or start a new one</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-green-500/20 hover:bg-green-500/30 px-4 py-2 rounded-lg text-green-500 text-sm md:text-base">
              + New Chat
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onChatCreated={handleChatCreated} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onUpdate={handleUpdateUser} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <TypingStyleModal isOpen={isTypingStyleOpen} onClose={() => setIsTypingStyleOpen(false)} />
      <TextColorPicker isOpen={isTextColorOpen} onClose={() => setIsTextColorOpen(false)} />
      <MusicPlayer />
    </div>
  );
};

export default Home;