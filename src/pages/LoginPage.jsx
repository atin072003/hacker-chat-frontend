import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Terminal, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimeLoginTheme from '../components/AnimeLoginTheme';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <AnimeLoginTheme>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glassmorphism rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Terminal className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold neon-text">HACKER CHAT</h1>
            <p className="text-gray-400 mt-2">Access Secure Terminal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 hacker-input"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 hacker-input"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-500 font-bold py-3 rounded-lg transition">
              Decrypt Session
            </button>
          </form>
          <p className="text-center text-gray-400 mt-6">
            No access? <Link to="/register" className="text-green-500 hover:underline">Request credentials</Link>
          </p>
        </div>
      </div>
    </AnimeLoginTheme>
  );
};

export default LoginPage;