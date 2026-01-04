
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const ANIMAL_AVATARS = [
  { id: 'lion', icon: '🦁', label: 'León', color: 'bg-orange-100' },
  { id: 'monkey', icon: '🐒', label: 'Mono', color: 'bg-amber-100' },
  { id: 'parrot', icon: '🦜', label: 'Guacamaya', color: 'bg-red-100' },
  { id: 'elephant', icon: '🐘', label: 'Elefante', color: 'bg-blue-100' }
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(ANIMAL_AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin({
        name: username.trim(),
        avatar: selectedAvatar.icon, // Usamos el emoji como avatar
        points: 0
      });
    } else {
      alert("¡Escribe tu nombre y contraseña para entrar a la selva!");
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

      <div className="bg-white/95 backdrop-blur-md p-8 rounded-[3.5rem] shadow-2xl border-b-8 border-green-700 max-w-md w-full z-10 relative">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className={`${selectedAvatar.color} w-28 h-28 rounded-full flex items-center justify-center shadow-xl border-4 border-white floating text-6xl`}>
            {selectedAvatar.icon}
          </div>
        </div>

        <div className="text-center mt-14 mb-8">
          <h1 className="text-6xl font-black text-green-800 mb-1 tracking-tighter">Kidoo</h1>
          <div className="inline-block bg-amber-400 px-4 py-1 rounded-full shadow-sm">
            <p className="text-green-900 font-black uppercase tracking-widest text-xs">Juega y Aprende</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-green-900 text-[10px] font-black text-center uppercase tracking-widest">¿Qué animal eres hoy?</label>
            <div className="grid grid-cols-4 gap-3">
              {ANIMAL_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`flex flex-col items-center p-2 rounded-2xl transition-all border-2 ${
                    selectedAvatar.id === av.id 
                    ? 'border-amber-400 bg-amber-50 scale-110 shadow-lg' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="text-3xl mb-1">{av.icon}</div>
                  <span className="text-[9px] font-black text-green-800 uppercase">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu nombre"
              className="w-full px-6 py-4 rounded-2xl bg-green-50 text-green-900 placeholder-green-300 border-2 border-green-100 focus:border-amber-400 outline-none transition-all font-bold text-lg text-center shadow-inner"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu clave secreta"
              className="w-full px-6 py-4 rounded-2xl bg-green-50 text-green-900 placeholder-green-300 border-2 border-green-100 focus:border-amber-400 outline-none transition-all font-bold text-lg text-center shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-5 rounded-2xl shadow-[0_6px_0_0_#166534] active:translate-y-1 active:shadow-none transition-all text-2xl uppercase tracking-widest mt-2"
          >
            ¡Entrar! 🦁
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center gap-2 text-white/50 font-bold bg-black/20 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest">
        Kidoo • El Bosque del Saber 🐾
      </div>
    </div>
  );
};

export default Login;
