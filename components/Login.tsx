
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Default explorer avatar to keep the app working without selection
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=KidooExplorer";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin({
        name: username.trim(),
        avatar: DEFAULT_AVATAR,
        points: 100
      });
    } else {
      alert("¡No olvides poner tu nombre y contraseña de explorador!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-green-900 via-emerald-800 to-amber-900">
      {/* Jungle Leaves Animation */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="leaf text-4xl" 
          style={{
            top: `-50px`,
            left: `${Math.random() * 100}%`,
            '--duration': `${10 + Math.random() * 15}s`
          } as any}
        >
          {['🌿', '🍃', '🍀', '🍂'][Math.floor(Math.random() * 4)]}
        </div>
      ))}

      <div className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl border-b-8 border-green-700 max-w-md w-full z-10 relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="bg-amber-400 w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white floating">
            <span className="text-5xl">🦁</span>
          </div>
        </div>

        <div className="text-center mt-12 mb-8">
          <h1 className="text-5xl font-bold text-green-800 mb-2 tracking-tighter">Kidoo</h1>
          <p className="text-emerald-700 font-semibold uppercase tracking-widest text-xs">Misión: Selva de Sabiduría</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-green-900 text-sm font-black ml-2 uppercase tracking-wide">Usuario Explorador</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: SuperLeo"
              className="w-full px-6 py-4 rounded-2xl bg-green-50 text-green-900 placeholder-green-300 border-2 border-green-100 focus:border-amber-400 outline-none transition-all font-bold text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-green-900 text-sm font-black ml-2 uppercase tracking-wide">Contraseña Secreta</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-green-50 text-green-900 placeholder-green-300 border-2 border-green-100 focus:border-amber-400 outline-none transition-all font-bold text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-extrabold py-5 rounded-2xl shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all text-2xl uppercase tracking-widest mt-4"
          >
            ¡Entrar a la Selva! 🌿
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center gap-2 text-white/70 font-bold bg-black/20 px-6 py-2 rounded-full">
        <span className="animate-pulse text-green-400 text-2xl">●</span> 
        Exploradores conectados: 1,432
      </div>
    </div>
  );
};

export default Login;
