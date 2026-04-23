import { useDispatch } from 'react-redux';
import api from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.accessToken);
      dispatch(setCredentials({ user: res.data.user, token: res.data.accessToken }));
      toast.success('Login successful');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  return { login, register };
};