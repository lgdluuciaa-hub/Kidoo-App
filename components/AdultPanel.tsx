
import React, { useState } from 'react';
import { GameResult } from '../types';
import { SUBJECTS } from './Dashboard';

interface AdultPanelProps {
  results: GameResult[];
  onBack: () => void;
}

const AdultPanel: React.FC<AdultPanelProps> = ({ results, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPrintTip, setShowPrintTip] = useState(false);

  const CORRECT_PASSWORD = 'maestro123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handlePrint = () => {
    setShowPrintTip(true);
    // Pequeña pausa para que el usuario lea el mensaje antes de que se abra el diálogo del sistema
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getHeatMapColor = (topicTitle: string, subjectTitle: string) => {
    const topicResults = results.filter(r => r.topic === topicTitle && r.subject === subjectTitle);
    if (topicResults.length === 0) return 'bg-slate-100 text-slate-400 border-slate-200';
    
    const avgScore = topicResults.reduce((acc, curr) => acc + curr.score, 0) / topicResults.length;
    
    if (avgScore >= 85) return 'bg-green-500 text-white border-green-600 shadow-sm';
    if (avgScore >= 60) return 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm';
    return 'bg-red-500 text-white border-red-600 shadow-sm animate-pulse';
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[3rem] shadow-2xl border-[12px] border-slate-800 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-black text-slate-800 uppercase">Acceso Adultos</h2>
          <p className="text-slate-500 font-bold">Ingresa la clave para ver resultados</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Clave de acceso"
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 border-4 border-slate-200 outline-none focus:border-slate-800 transition-all text-center text-xl font-bold"
            autoFocus
          />
          {error && <p className="text-red-500 text-center font-bold">¡Clave incorrecta!</p>}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all"
            >
              ENTRAR
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fadeIn print:p-0 print:m-0">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-slate-800 min-h-[80vh] print:border-none print:rounded-none print:shadow-none">
        
        <div className="bg-slate-800 p-8 flex justify-between items-center text-white print:bg-white print:text-black print:border-b-4 print:border-slate-800">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Reporte de Expedición 🗺️</h2>
            <p className="font-bold text-slate-400 print:text-slate-600">Monitoreo de Dominio de Aprendizaje - 4to Grado</p>
          </div>
          <div className="flex flex-col items-end gap-2 print:hidden">
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 active:scale-95"
              >
                <span>📄</span> GENERAR PDF
              </button>
              <button 
                onClick={onBack}
                className="bg-white text-slate-800 font-black px-6 py-3 rounded-2xl hover:bg-slate-200 transition-all"
              >
                VOLVER
              </button>
            </div>
            {showPrintTip && (
              <p className="text-[10px] font-bold text-emerald-400 animate-bounce">
                💡 Tip: Selecciona "Guardar como PDF" en el menú que aparecerá.
              </p>
            )}
          </div>
        </div>

        <div className="p-8 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-4">
              <h3 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
                <span className="bg-slate-100 p-2 rounded-xl">🌡️</span> Mapa de Calor
              </h3>
              <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500"></div> Crítico</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-400"></div> En Proceso</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500"></div> Dominado</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUBJECTS.map((subject) => (
                <div key={subject.id} className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex flex-col print:bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{subject.icon}</span>
                    <h4 className="font-black text-slate-700 uppercase text-xs tracking-wider">{subject.title}</h4>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {subject.blocks.map((block) => (
                      <div 
                        key={block.id} 
                        className={`aspect-square rounded-xl border-2 flex items-center justify-center text-xs transition-all relative group ${getHeatMapColor(block.title, subject.title)}`}
                      >
                        {block.icon}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-800 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-[10px] text-center shadow-xl font-bold print:hidden">
                          {block.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="print:mt-10">
            <h3 className="text-2xl font-black text-slate-800 uppercase mb-8 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <span className="bg-slate-100 p-2 rounded-xl">📋</span> Detalle de Actividades
            </h3>
            {results.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200">
                <p className="text-slate-400 text-xl font-bold italic">No hay registros de misiones esta semana.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-100 bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-100">
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      <th className="p-6">Materia</th>
                      <th className="p-6">Tema</th>
                      <th className="p-6 text-center">Calificación</th>
                      <th className="p-6">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((res, i) => (
                      <tr key={i} className="text-sm font-bold text-slate-600">
                        <td className="p-6 uppercase text-xs font-black text-slate-800">{res.subject}</td>
                        <td className="p-6">{res.topic}</td>
                        <td className="p-6 text-center">
                          <span className={`px-4 py-1 rounded-full text-xs font-black ${
                            res.score >= 85 ? 'text-green-600 bg-green-50' : 
                            res.score >= 60 ? 'text-yellow-600 bg-yellow-50' : 
                            'text-red-600 bg-red-50'
                          }`}>
                            {res.score}%
                          </span>
                        </td>
                        <td className="p-6 text-[10px] text-slate-400">{res.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 text-center print:bg-white print:pt-20">
          <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Reporte Educativo Kidoo • Generado el {new Date().toLocaleDateString()}</p>
          <div className="hidden print:block mt-12 flex justify-around">
            <div className="border-t-2 border-slate-800 pt-2 px-12 text-xs font-black uppercase">Firma del Maestro</div>
            <div className="border-t-2 border-slate-800 pt-2 px-12 text-xs font-black uppercase">Firma del Padre</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #root { background: white !important; }
          .min-h-screen { background: white !important; min-height: auto !important; }
          main { padding-top: 0 !important; }
          @page { size: auto; margin: 15mm; }
          nav, button, .print\\:hidden { display: none !important; }
          .shadow-2xl, .shadow-xl, .shadow-lg { shadow: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdultPanel;
