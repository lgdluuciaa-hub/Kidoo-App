
import React from 'react';
import { SubjectId, AppView, TopicBlock } from '../types';
import { SUBJECTS } from './Dashboard';

interface TopicSelectionProps {
  subjectId: SubjectId;
  onSelectTopic: (view: AppView, topic: TopicBlock) => void;
}

const TopicSelection: React.FC<TopicSelectionProps> = ({ subjectId, onSelectTopic }) => {
  const subject = SUBJECTS.find(s => s.id === subjectId);

  if (!subject) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-white/20 p-4 rounded-3xl mb-4 border border-white/20 shadow-xl">
            <span className="text-6xl">{subject.icon}</span>
        </div>
        <h2 className="text-4xl font-black text-white mb-2">{subject.title}</h2>
        <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Selecciona tu Misión de Aprendizaje</p>
      </div>

      <div className="space-y-4">
        {subject.blocks.map((block, index) => (
          <button
            key={block.id}
            onClick={() => onSelectTopic(subject.view, block)}
            className="w-full group bg-white hover:bg-emerald-50 rounded-[2rem] p-6 flex items-center gap-6 transition-all hover:-translate-x-2 border-l-[12px] border-emerald-500 shadow-xl text-left"
          >
            <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {block.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Bloque {index + 1}</span>
                <h3 className="text-2xl font-black text-emerald-900 leading-none">{block.title}</h3>
              </div>
              <p className="text-emerald-700/70 font-bold text-sm">{block.description}</p>
            </div>

            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 flex items-center justify-center text-emerald-300 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
          <div className="bg-green-800/40 px-8 py-3 rounded-2xl border border-white/10 text-white/60 font-bold text-sm">
            Completa los 5 bloques para ganar una Medalla de Oro 🏅
          </div>
      </div>
    </div>
  );
};

export default TopicSelection;
