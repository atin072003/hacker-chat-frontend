import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  activeChat: null,
  messages: {},
  typingUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => { state.chats = action.payload; },
    setActiveChat: (state, action) => { state.activeChat = action.payload; },
    addMessage: (state, action) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) state.messages[chatId] = [];
      if (!state.messages[chatId].some(m => m._id === action.payload._id)) {
        state.messages[chatId].push(action.payload);
      }
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    updateMessageReactions: (state, action) => {
      const { messageId, reactions } = action.payload;
      for (const chatId in state.messages) {
        const msg = state.messages[chatId].find(m => m._id === messageId);
        if (msg) { msg.reactions = reactions; break; }
      }
    },
    updateMessageReadBy: (state, action) => {
      const { messageId, userId } = action.payload;
      for (const chatId in state.messages) {
        const msg = state.messages[chatId].find(m => m._id === messageId);
        if (msg && !msg.readBy.includes(userId)) {
          msg.readBy.push(userId);
          break;
        }
      }
    },
    deleteMessage: (state, action) => {
      const { messageId, chatId } = action.payload;
      if (state.messages[chatId]) {
        const msg = state.messages[chatId].find(m => m._id === messageId);
        if (msg) msg.deletedForEveryone = true;
      }
    },
    updateTyping: (state, action) => {
      if (action.payload.isTyping) {
        if (!state.typingUsers.includes(action.payload.userId))
          state.typingUsers.push(action.payload.userId);
      } else {
        state.typingUsers = state.typingUsers.filter(id => id !== action.payload.userId);
      }
    }
  }
});

export const { 
  setChats, setActiveChat, addMessage, setMessages, 
  updateMessageReactions, updateMessageReadBy, deleteMessage, updateTyping 
} = chatSlice.actions;
export default chatSlice.reducer;