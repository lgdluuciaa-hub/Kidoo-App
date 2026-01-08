
import React, { useState } from 'react';
import { User } from '../types';
import { AvatarIcon, AvatarId } from './AvatarIcon';

interface LoginProps {
  onLogin: (user: User) => void;
}

const ANIMAL_AVATARS: { id: AvatarId; label: string; color: string; glow: string }[] = [
  { id: 'tiger', label: 'Tigre', color: 'bg-orange-400', glow: 'ring-orange-200' },
  { id: 'panda', label: 'Panda', color: 'bg-slate-300', glow: 'ring-slate-100' },
  { id: 'koala', label: 'Koala', color: 'bg-emerald-400', glow: 'ring-emerald-200' },
  { id: 'fox', label: 'Zorro', color: 'bg-amber-500', glow: 'ring-amber-200' }
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
        avatar: selectedAvatar.id,
        points: 0
      });
    } else {
      alert("¡Escribe tu nombre y contraseña para entrar a la selva!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-lime-500 to-emerald-600">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/20 rounded-full blur-3xl"></div>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-[4rem] shadow-2xl border-b-[12px] border-emerald-600 max-w-md w-full z-10 relative">
        
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className={`${selectedAvatar.color} w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-8 border-white p-4 transition-all duration-500 hover:scale-110`}>
            <AvatarIcon id={selectedAvatar.id} />
          </div>
        </div>

        <div className="text-center mt-16 mb-10">
          <h1 className="text-7xl font-black text-emerald-800 mb-2 tracking-tighter drop-shadow-sm">Kidoo</h1>
          <div className="inline-block bg-yellow-400 px-6 py-1.5 rounded-full shadow-lg transform -rotate-1">
            <p className="text-emerald-900 font-black uppercase tracking-widest text-xs">Juega y Aprende</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-emerald-900 text-[11px] font-black text-center uppercase tracking-widest opacity-70">¿Qué animal eres hoy?</label>
            
            <div className="flex justify-center gap-4">
              {ANIMAL_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`
                    relative group w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center p-2
                    ${selectedAvatar.id === av.id 
                      ? `${av.color} scale-125 shadow-2xl ring-8 ${av.glow} z-20` 
                      : 'bg-emerald-50 opacity-60 hover:opacity-100 hover:scale-110'
                    }
                  `}
                >
                  <AvatarIcon id={av.id} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de explorador"
              className="w-full px-8 py-5 rounded-[2rem] bg-emerald-50 text-emerald-900 placeholder-emerald-200 border-4 border-emerald-100 focus:border-yellow-400 focus:bg-white outline-none transition-all font-black text-xl text-center shadow-inner"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave secreta"
              className="w-full px-8 py-5 rounded-[2rem] bg-emerald-50 text-emerald-900 placeholder-emerald-200 border-4 border-emerald-100 focus:border-yellow-400 focus:bg-white outline-none transition-all font-black text-xl text-center shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-6 rounded-[2rem] shadow-[0_10px_0_0_#059669] active:translate-y-2 active:shadow-[0_4px_0_0_#059669] transition-all text-2xl uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3 border-t-4 border-white/30"
          >
            ¡ENTRAR! 🐾
          </button>
        </form>
      </div>

      <div className="mt-12 text-emerald-900/60 font-black uppercase tracking-[0.4em] text-[10px] bg-white/30 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm">
        Explora • Aprende • Diviértete 🐾
      </div>
    </div>
  );
};

export default Login;
