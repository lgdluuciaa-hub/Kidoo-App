
import React, { useState, useEffect } from 'react';
import { SubjectId, TopicBlock } from '../types';
import { searchKnowledge } from '../services/gemini';

interface DiscoveryWorldProps {
  subjectId: SubjectId;
  topic: TopicBlock | null;
}

const DiscoveryWorld: React.FC<DiscoveryWorldProps> = ({ subjectId, topic }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
      // Reset when topic changes
      setResult(null);
      setQuery('');
  }, [topic]);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    const context = `Contexto: 4to grado primaria México. Materia ${subjectId.toUpperCase()}, Bloque "${topic?.title}". `;
    const res = await searchKnowledge(`${context} Investigación sobre: ${query}`);
    setResult(res);
    setIsSearching(false);
  };

  const getSubjectColor = () => subjectId === 'history' ? 'border-amber-700 bg-amber-700' : 'border-cyan-600 bg-cyan-600';

  return (
    <div className={`max-w-4xl mx-auto flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] ${getSubjectColor().split(' ')[0]} min-h-[70vh]`}>
      <div className={`${getSubjectColor().split(' ')[1]} p-8 text-center text-white`}>
        <div className="text-5xl mb-2">{topic?.icon || '🌍'}</div>
        <h2 className="text-3xl font-black tracking-tight">{topic?.title}</h2>
        <p className="text-white/80 font-bold">{subjectId === 'history' ? 'Explorando el pasado' : 'Conociendo el mundo'}</p>
      </div>

      <div className="p-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`¿Qué quieres investigar de "${topic?.title}"?`}
            className="flex-1 px-8 py-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-green-500 outline-none text-xl font-medium transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="bg-green-600 hover:bg-green-500 text-white font-black px-10 rounded-2xl shadow-xl shadow-green-600/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSearching ? '🛰️...' : 'Investigar 🔍'}
          </button>
        </div>

        {isSearching ? (
          <div className="text-center py-20">
            <div className="text-6xl animate-spin inline-block mb-4">🌀</div>
            <p className="text-slate-700 font-black text-xl">Escaneando archivos secretos de la selva...</p>
          </div>
        ) : result ? (
          <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-slate-100 animate-fadeIn">
            <h3 className="text-slate-800 text-2xl font-black mb-6">Hallazgos de la expedición:</h3>
            <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed mb-8">
              {result.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
            
            {result.sources.length > 0 && (
              <div className="border-t-2 border-slate-200 pt-6">
                <h4 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
                  <span>🔗</span> Mapas y Libros adicionales:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {result.sources.map((chunk, idx) => (
                    chunk.web?.uri && (
                      <a
                        key={idx}
                        href={chunk.web.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white px-4 py-2 rounded-xl text-green-700 font-bold border border-green-200 hover:bg-green-50 transition-all text-sm shadow-sm"
                      >
                        {chunk.web.title || 'Ver evidencia'}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-300">
            <div className="text-8xl mb-4 opacity-20">{topic?.icon}</div>
            <p className="text-xl font-bold">Inicia una búsqueda para descubrir los misterios de este bloque</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryWorld;
