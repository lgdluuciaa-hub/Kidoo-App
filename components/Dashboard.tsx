
import React from 'react';
import { User, AppView, Subject, SubjectId } from '../types';

interface DashboardProps {
  user: User;
  setView: (view: AppView) => void;
  setSelectedSubject: (subjectId: SubjectId) => void;
}

export const SUBJECTS: Subject[] = [
  {
    id: 'language',
    title: "Lenguajes",
    icon: "📚",
    description: "Lectura, escritura y expresión",
    color: "bg-red-500",
    view: AppView.THINKING_LAB,
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
    view: AppView.THINKING_LAB,
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
    view: AppView.THINKING_LAB,
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
    view: AppView.WORLD_EXPLORER,
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
    view: AppView.WORLD_EXPLORER,
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
    view: AppView.THINKING_LAB,
    blocks: [
      { id: 'c1', title: 'Derechos del Niño', description: 'Protección y bienestar', icon: '👦' },
      { id: 'c2', title: 'Vivir en Democracia', description: 'Participación y justicia', icon: '🗳️' },
      { id: 'c3', title: 'Cuidado Ambiental', description: 'Misión: Salvar el planeta', icon: '🌍' },
      { id: 'c4', title: 'Igualdad de Género', description: 'Hombres y mujeres valemos igual', icon: '🤝' },
      { id: 'c5', title: 'Paz y Conflictos', description: 'Hablando se entiende la gente', icon: '🕊️' }
    ]
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user, setView, setSelectedSubject }) => {
  const handleModuleClick = (subjectId: SubjectId) => {
    setSelectedSubject(subjectId);
    setView(AppView.TOPIC_SELECTION);
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
            onClick={() => handleModuleClick(subject.id)}
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
              Abrir Materia 🔓
            </div>
          </button>
        ))}
        
        {/* Special Art Module Link */}
        <button
          onClick={() => setView(AppView.ART_STUDIO)}
          className="bg-orange-500 group relative p-8 rounded-[2rem] text-left transition-all hover:-translate-y-2 hover:shadow-2xl border-b-8 border-black/20 overflow-hidden flex flex-col h-full"
        >
          <div className="absolute -top-4 -right-4 p-4 opacity-10 text-9xl">🎨</div>
          <div className="relative z-10 flex-1">
            <div className="bg-white/20 w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-4xl mb-6">🎨</div>
            <h3 className="text-2xl font-black text-white mb-2">Pintura Mágica</h3>
            <p className="text-white/80 font-bold text-sm">IA para crear tus animales salvajes</p>
          </div>
          <div className="mt-6 bg-black/20 py-3 rounded-xl text-white text-center font-black text-xs uppercase tracking-widest">¡Crear Ahora! ✨</div>
        </button>
      </div>

      <footer className="mt-12 text-center text-white/40 text-sm font-bold">
        Kidoo • El Bosque del Conocimiento 🐾
      </footer>
    </div>
  );
};

export default Dashboard;
