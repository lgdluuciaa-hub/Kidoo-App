
import React from 'react';
import { User, AppView, Subject, SubjectId } from '../types';

interface DashboardProps {
  user: User;
  setView: (view: AppView) => void;
  setSelectedSubject: (subjectId: SubjectId) => void;
}

const SUBJECTS: Subject[] = [
  {
    id: 'language',
    title: "Lenguajes (Español)",
    icon: "📚",
    description: "Lectura, escritura y expresión oral",
    color: "bg-red-500",
    view: AppView.THINKING_LAB
  },
  {
    id: 'math',
    title: "Matemáticas",
    icon: "🔢",
    description: "Fracciones, geometría y problemas",
    color: "bg-blue-600",
    view: AppView.THINKING_LAB
  },
  {
    id: 'science',
    title: "Ciencias Naturales",
    icon: "🧪",
    description: "Salud, ecosistemas y materiales",
    color: "bg-emerald-600",
    view: AppView.THINKING_LAB
  },
  {
    id: 'history',
    title: "Historia",
    icon: "🏺",
    description: "Aspectos de la historia de México",
    color: "bg-amber-700",
    view: AppView.WORLD_EXPLORER
  },
  {
    id: 'geography',
    title: "Geografía",
    icon: "🗺️",
    description: "Cartografía, México y el mundo",
    color: "bg-cyan-600",
    view: AppView.WORLD_EXPLORER
  },
  {
    id: 'civics',
    title: "Formación Cívica y Ética",
    icon: "⚖️",
    description: "Valores, derechos y ambiente",
    color: "bg-indigo-600",
    view: AppView.THINKING_LAB
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user, setView, setSelectedSubject }) => {
  const handleModuleClick = (subject: Subject) => {
    setSelectedSubject(subject.id);
    setView(subject.view);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white/20 mb-8 shadow-xl">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="relative">
            <div className="w-20 h-20 rounded-[1.5rem] border-4 border-amber-400 shadow-lg bg-green-50 overflow-hidden">
              <img src={user.avatar} className="w-full h-full object-cover" alt="User Avatar" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">¡Hola, {user.name}!</h2>
            <p className="text-amber-400 font-bold">Explorador de 4to Grado 🎒</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-green-800/60 px-6 py-3 rounded-2xl border border-white/10">
          <div className="bg-amber-400 w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-inner">🍌</div>
          <div className="text-right">
            <p className="text-emerald-200 text-[10px] uppercase font-black">Bananas de Poder</p>
            <p className="text-white text-xl font-black">{user.points}</p>
          </div>
        </div>
      </header>

      <div className="mb-8 text-center">
        <h3 className="text-white text-2xl font-black uppercase tracking-widest">Módulos de 4to Grado</h3>
        <p className="text-green-300 font-medium mt-2">¿Qué aventura de aprendizaje elegimos hoy?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleModuleClick(subject)}
            className={`${subject.color} group relative p-8 rounded-[2rem] text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-b-8 border-black/20 overflow-hidden flex flex-col h-full`}
          >
            <div className="absolute -top-4 -right-4 p-4 opacity-10 text-9xl transition-transform group-hover:scale-110 group-hover:-rotate-6">
              {subject.icon}
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="bg-white/20 w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition-transform shadow-lg border border-white/30">
                {subject.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-2 leading-none">
                {subject.title}
              </h3>
              <p className="text-white/80 font-bold text-sm">
                {subject.description}
              </p>
            </div>
            
            <div className="mt-6 inline-flex items-center justify-center bg-black/20 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-black/30 transition-colors w-full relative z-10">
              Abrir Módulo 🔓
            </div>
          </button>
        ))}
      </div>

      <footer className="mt-12 text-center text-white/40 text-sm font-bold">
        Kidoo • El Bosque del Conocimiento 🐾
      </footer>
    </div>
  );
};

// Fix: Adding default export for Dashboard component
export default Dashboard;
