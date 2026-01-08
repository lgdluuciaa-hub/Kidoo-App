
import React, { useState, useEffect } from 'react';
import { GameResult } from '../types';
import { getThinkingResponse } from '../services/gemini';

interface WisdomJournalProps {
  results: GameResult[];
  userName: string;
}

const WisdomJournal: React.FC<WisdomJournalProps> = ({ results, userName }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoading(true);
      const historySummary = results.length > 0 
        ? results.map(r => `${r.subject} (${r.topic}): ${r.score}%`).join(', ')
        : "Aún no ha completado misiones.";
      
      const prompt = `Analiza el progreso de ${userName}. Resultados: ${historySummary}. 
      Como Kidoo el guía de la selva, felicítalo por sus fortalezas y dale un consejo divertido y motivador sobre qué materia o tema debería practicar más según sus puntajes más bajos o si no ha jugado nada. Manténlo muy breve y emocionante.`;
      
      const res = await getThinkingResponse(prompt);
      setAdvice(res);
      setIsLoading(false);
    };

    fetchAdvice();
  }, [results, userName]);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-emerald-500">
        <div className="bg-emerald-500 p-8 text-center">
          <h2 className="text-white text-4xl font-black uppercase tracking-tighter">Bitácora de Sabiduría 📖</h2>
          <p className="text-emerald-100 font-bold">Tus huellas en la selva del aprendizaje</p>
        </div>

        <div className="p-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-6xl animate-spin mb-4">🌿</div>
              <p className="text-emerald-800 font-black animate-pulse uppercase">Kidoo está analizando tus huellas...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border-4 border-emerald-100 shadow-xl relative">
                <div className="absolute -top-6 -left-4 text-6xl">🦜</div>
                <p className="text-2xl font-bold text-slate-700 leading-relaxed italic">
                  "{advice}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-100">
                  <h3 className="text-blue-800 font-black uppercase text-sm mb-3">Tus Superpoderes 💪</h3>
                  {results.filter(r => r.score >= 90).length > 0 ? (
                    <div className="space-y-2">
                      {Array.from(new Set(results.filter(r => r.score >= 90).map(r => r.subject))).map(s => (
                        <div key={s} className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
                          <span className="text-xl">🏆</span>
                          <span className="font-bold text-blue-700">{s}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-blue-400 font-bold">¡Pronto desbloquearás tus primeros superpoderes!</p>
                  )}
                </div>

                <div className="bg-orange-50 p-6 rounded-3xl border-4 border-orange-100">
                  <h3 className="text-orange-800 font-black uppercase text-sm mb-3">Próximo Rastro 🐾</h3>
                  <p className="text-orange-700 font-bold">
                    Sigue explorando para que Kidoo pueda guiarte mejor en tu expedición.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WisdomJournal;
