import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Terminal, User, Mail, Lock } from 'lucide-react';
import AnimeLoginTheme from '../components/AnimeLoginTheme';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({
      ...form,
      publicKey: 'dummy',
      encryptedPrivateKey: 'dummy'
    });
    if (success) navigate('/login');
  };

  return (
    <AnimeLoginTheme>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glassmorphism rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Terminal className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold neon-text">JOIN THE NET</h1>
            <p className="text-gray-400 mt-2">Create your secure account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 hacker-input"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 hacker-input"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 hacker-input"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-500 font-bold py-3 rounded-lg transition"
            >
              Initialize Account
            </button>
          </form>
          <p className="text-center text-gray-400 mt-6">
            Already have access?{' '}
            <a href="/login" className="text-green-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </AnimeLoginTheme>
  );
};

export default RegisterPage;