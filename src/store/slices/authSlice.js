import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  onlineUsers: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      return initialState;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers[action.payload.userId] = action.payload.status;
    },
  },
});

export const { setCredentials, logout, setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;