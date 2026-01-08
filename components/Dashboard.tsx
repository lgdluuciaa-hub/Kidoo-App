
import React from 'react';
import { User, AppView, Subject, SubjectId } from '../types';
import { AvatarIcon } from './AvatarIcon';

export const SUBJECTS: Subject[] = [
  // ... (mismos sujetos que antes)
  {
    id: 'language',
    title: "Lenguajes",
    icon: "📚",
    description: "Lectura, escritura y expresión",
    color: "bg-red-500",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 'l1', title: 'Relatos y Cuentos', description: 'Narrativas y personajes fantásticos', icon: '📖' },
      { id: 'l2', title: 'Textos Expositivos', description: 'Aprende a informar sobre temas', icon: '📑' },
      { id: 'l3', title: 'Poesía y Rimas', description: 'El ritmo de las palabras', icon: '✍️' },
      { id: 'l4', title: 'Anuncios Publicitarios', description: 'Mensajes que convencen', icon: '📢' },
      { id: 'l5', title: 'La Entrevista', description: 'Preguntas para conocer el mundo', icon: '🎙️' }
    ]
  },
  {
    id: 'math',
    title: "Matemáticas",
    icon: "🔢",
    description: "Números y desafíos lógicos",
    color: "bg-blue-600",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 'm1', title: 'Fracciones Mágicas', description: 'Partes de un todo con sabor', icon: '🍰' },
      { id: 'm2', title: 'Multiplicaciones Gigantes', description: 'Cálculos rápidos y exactos', icon: '✖️' },
      { id: 'm3', title: 'Ángulos y Triángulos', description: 'Formas en nuestra selva', icon: '📐' },
      { id: 'm4', title: 'Perímetros y Áreas', description: 'Midiendo el territorio', icon: '📏' },
      { id: 'm5', title: 'Gráficas de Aventura', description: 'Datos que cuentan historias', icon: '📊' }
    ]
  },
  {
    id: 'science',
    title: "Ciencias Naturales",
    icon: "🧪",
    description: "Ecosistemas y salud",
    color: "bg-emerald-600",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 's1', title: 'Mi Cuerpo y la Salud', description: 'Sistema inmune y vacunas', icon: '🛡️' },
      { id: 's2', title: 'Ecosistemas de México', description: 'Flora y fauna de nuestra tierra', icon: '🌵' },
      { id: 's3', title: 'Estados de la Materia', description: 'Sólidos, líquidos y gases', icon: '🧊' },
      { id: 's4', title: 'Electricidad y Magnetismo', description: 'Fuerzas invisibles', icon: '⚡' },
      { id: 's5', title: 'El Sistema Solar', description: 'Viaje por los planetas', icon: '🪐' }
    ]
  },
  {
    id: 'history',
    title: "Historia",
    icon: "🏺",
    description: "México a través del tiempo",
    color: "bg-amber-700",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 'h1', title: 'Mesoamérica Antigua', description: 'Mayas, Olmecas y Aztecas', icon: '🗿' },
      { id: 'h2', title: 'El Encuentro de Dos Mundos', description: 'La Conquista de México', icon: '⛵' },
      { id: 'h3', title: 'La Época Virreinal', description: 'Vida en la Nueva España', icon: '🏰' },
      { id: 'h4', title: 'Grito de Independencia', description: 'Héroes que nos dieron patria', icon: '🔔' },
      { id: 'h5', title: 'Vida Cotidiana del Pasado', description: '¿Cómo vivían antes?', icon: '🏠' }
    ]
  },
  {
    id: 'geography',
    title: "Geografía",
    icon: "🗺️",
    description: "México y sus regiones",
    color: "bg-cyan-600",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 'g1', title: 'Límites y Fronteras', description: 'El mapa de nuestro México', icon: '🇲🇽' },
      { id: 'g2', title: 'Ríos y Montañas', description: 'Relieve de nuestro país', icon: '🏔️' },
      { id: 'g3', title: 'Diversidad de Climas', description: 'De la selva al desierto', icon: '☀️' },
      { id: 'g4', title: 'Población de México', description: 'Gente del campo y ciudad', icon: '👨‍👩‍👧‍👦' },
      { id: 'g5', title: 'Riquezas de mi Tierra', description: 'Agricultura y minería', icon: '💎' }
    ]
  },
  {
    id: 'civics',
    title: "Cívica y Ética",
    icon: "⚖️",
    description: "Valores y convivencia",
    color: "bg-indigo-600",
    view: AppView.SUBJECT_GAME,
    blocks: [
      { id: 'c1', title: 'Derechos del Niño', description: 'Protección y bienestar', icon: '👦' },
      { id: 'c2', title: 'Vivir en Democracia', description: 'Participación y justicia', icon: '🗳️' },
      { id: 'c3', title: 'Cuidado Ambiental', description: 'Misión: Salvar el planeta', icon: '🌍' },
      { id: 'c4', title: 'Igualdad de Género', description: 'Hombres y mujeres valemos igual', icon: '🤝' },
      { id: 'c5', title: 'Paz y Conflictos', description: 'Hablando se entiende la gente', icon: '🕊️' }
    ]
  }
];

const Dashboard: React.FC<{ user: User; setView: (v: AppView) => void; setSelectedSubject: (id: SubjectId) => void; }> = ({ user, setView, setSelectedSubject }) => {
  const handleModuleClick = (subjectId: SubjectId) => {
    setSelectedSubject(subjectId);
    setView(AppView.TOPIC_SELECTION);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row items-center justify-between bg-white/20 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white/20 mb-8 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-white flex items-center justify-center p-3 shadow-lg">
            <AvatarIcon id={user.avatar} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">¡Hola, {user.name}!</h2>
            <p className="text-emerald-100 font-bold uppercase text-xs tracking-widest mt-1">Explorador de 4to Grado</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button 
            onClick={() => setView(AppView.ADULT_PANEL)}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl border border-white/20 shadow-lg transition-all active:scale-95 group"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🔒</span>
            <span className="font-black uppercase text-[10px] tracking-widest">Tu progreso</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <button key={subject.id} onClick={() => handleModuleClick(subject.id)} className={`${subject.color} group relative p-8 rounded-[2.5rem] text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-b-8 border-black/20 overflow-hidden flex flex-col h-full`}>
            <div className="absolute -top-4 -right-4 p-4 opacity-10 text-9xl transition-transform group-hover:scale-110 group-hover:-rotate-6">{subject.icon}</div>
            <div className="bg-white/20 w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-4xl mb-6 shadow-lg border border-white/30">{subject.icon}</div>
            <h3 className="text-2xl font-black text-white mb-2">{subject.title}</h3>
            <p className="text-white/80 font-bold text-sm flex-1">{subject.description}</p>
            <div className="mt-6 inline-flex items-center justify-center bg-black/20 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest w-full">Ver misiones 🔓</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
