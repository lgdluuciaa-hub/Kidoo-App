
import React, { useState, useEffect, useRef } from 'react';
import { TopicBlock, SubjectId } from '../types';

interface SubjectGameProps {
  topic: TopicBlock | null;
  subjectId: SubjectId;
  onFinish: () => void;
}

const GAME_TYPES = {
  PUZZLE: 'puzzle',
  SHOOTER: 'shooter',
  MATCHER: 'matcher',
  MATH_INPUT: 'math_input'
};

const SubjectGame: React.FC<SubjectGameProps> = ({ topic, subjectId, onFinish }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [score, setScore] = useState(0);
  
  // States for specific games
  const [mathValue, setMathValue] = useState('');
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [matchedItems, setMatchedItems] = useState<number[]>([]);
  const [selectedInColumn, setSelectedInColumn] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Game Definitions per Subject (Bloque 1)
  const getGameConfig = () => {
    switch(subjectId) {
      case 'math': return {
        type: GAME_TYPES.MATH_INPUT,
        title: 'Defensa Numérica',
        instruction: 'Teclea el resultado correcto para disparar el rayo purificador.',
        levels: [
          { q: '15 + 25 = ?', a: '40' },
          { q: '100 - 45 = ?', a: '55' },
          { q: '8 x 7 = ?', a: '56' },
          { q: '1/2 + 1/2 = ? (Enteros)', a: '1' },
          { q: '250 + 250 = ?', a: '500' }
        ]
      };
      case 'language': return {
        type: GAME_TYPES.PUZZLE,
        title: 'Rompecabezas de Cuentos',
        instruction: 'Haz clic en las piezas para ordenarlas y ver la portada.',
        levels: [
          { pieces: [3, 0, 2, 1], solved: [0, 1, 2, 3], icon: '📖' }
        ]
      };
      case 'science': return {
        type: GAME_TYPES.MATCHER,
        title: 'Conexión Vital',
        instruction: 'Une cada sistema con su órgano principal.',
        left: ['S. Respiratorio', 'S. Digestivo', 'S. Óseo', 'S. Circulatorio'],
        right: ['Corazón', 'Huesos', 'Estómago', 'Pulmones'],
        pairs: { 0: 3, 1: 2, 2: 1, 3: 0 } as Record<number, number>
      };
      case 'history': return {
        type: GAME_TYPES.MATCHER,
        title: 'Mesoamérica Antigua',
        instruction: 'Relaciona la cultura con su legado.',
        left: ['Olmecas', 'Mayas', 'Mexicas (Aztecas)', 'Zapotecas'],
        right: ['Gran Tenochtitlan', 'Cabezas Gigantes', 'Monte Albán', 'Calendario y Cero'],
        pairs: { 0: 1, 1: 3, 2: 0, 3: 2 } as Record<number, number>
      };
      case 'geography': return {
        type: GAME_TYPES.SHOOTER,
        title: 'Tiro al Mapa',
        instruction: '¡Haz clic en el país que es frontera con México al SUR!',
        options: ['Canadá', 'Guatemala', 'España', 'Brasil'],
        correct: 1
      };
      default: return null;
    }
  };

  const config = getGameConfig();

  useEffect(() => {
    // FIX: Using type assertion to access 'pieces' property on levels for PUZZLE game
    if (config?.type === GAME_TYPES.PUZZLE && 'levels' in config) {
      setPuzzlePieces((config.levels[0] as any).pieces);
    }
    if (config?.type === GAME_TYPES.MATH_INPUT) {
      inputRef.current?.focus();
    }
  }, [subjectId, config]);

  if (!config) return null;

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Using type assertion to access 'a' property (answer) on levels for MATH_INPUT game
    if ('levels' in config && mathValue === (config.levels[currentLevel] as any).a) {
      handleSuccess();
      setMathValue('');
    } else {
      handleError();
    }
  };

  const handlePuzzleClick = (idx: number) => {
    const newPieces = [...puzzlePieces];
    const nextIdx = (idx + 1) % puzzlePieces.length;
    // Simple swap for demo puzzle
    [newPieces[idx], newPieces[nextIdx]] = [newPieces[nextIdx], newPieces[idx]];
    setPuzzlePieces(newPieces);
    
    // FIX: Using type assertion to access 'solved' property on levels for PUZZLE game
    if ('levels' in config && JSON.stringify(newPieces) === JSON.stringify((config.levels[0] as any).solved)) {
      handleSuccess();
    }
  };

  const handleMatcherClick = (idx: number, isRight: boolean) => {
    if (!isRight) {
      setSelectedInColumn(idx);
    } else if (selectedInColumn !== null) {
      // FIX: Accessing 'pairs' safely via type assertion since not all configs have it
      if ('pairs' in config && (config as any).pairs[selectedInColumn] === idx) {
        setMatchedItems([...matchedItems, selectedInColumn]);
        setSelectedInColumn(null);
        if (matchedItems.length + 1 === (config as any).left.length) {
          handleSuccess();
        }
      } else {
        handleError();
        setSelectedInColumn(null);
      }
    }
  };

  const handleShooterClick = (idx: number) => {
    // FIX: Accessing 'correct' property safely via type assertion for SHOOTER game
    if ('correct' in config && idx === (config as any).correct) {
      handleSuccess();
    } else {
      handleError();
    }
  };

  const handleSuccess = () => {
    setFeedback('success');
    setScore(s => s + 20);
    setTimeout(() => {
      setFeedback(null);
      // FIX: Using type assertion to check levels length for MATH_INPUT game transitions
      if (config.type === GAME_TYPES.MATH_INPUT && 'levels' in config && currentLevel < (config.levels as any[]).length - 1) {
        setCurrentLevel(l => l + 1);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  const handleError = () => {
    setFeedback('error');
    setTimeout(() => setFeedback(null), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className={`bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-amber-400 flex flex-col min-h-[70vh]`}>
        
        <div className="bg-amber-400 p-6 text-white text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight">{config.title}</h2>
          <p className="text-amber-900 font-bold opacity-80">{config.instruction}</p>
        </div>

        <div className="flex-1 p-10 flex flex-col items-center justify-center relative bg-slate-50">
          
          {feedback && (
            <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm`}>
               <div className={`text-9xl animate-bounce ${feedback === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                 {feedback === 'success' ? '🌟' : '❌'}
               </div>
            </div>
          )}

          {!isFinished ? (
            <div className="w-full">
              {/* MATH INPUT GAME */}
              {config.type === GAME_TYPES.MATH_INPUT && 'levels' in config && (
                <div className="text-center space-y-10">
                  <div className="text-7xl font-black text-blue-600 bg-white p-12 rounded-[3rem] shadow-xl inline-block border-8 border-blue-100">
                    {/* FIX: Using type assertion to access question 'q' on current level */}
                    {(config.levels[currentLevel] as any).q}
                  </div>
                  <form onSubmit={handleMathSubmit} className="flex flex-col items-center gap-6">
                    <input 
                      ref={inputRef}
                      type="number" 
                      value={mathValue}
                      onChange={(e) => setMathValue(e.target.value)}
                      placeholder="?"
                      className="w-40 text-center text-5xl font-black p-6 rounded-3xl border-4 border-slate-200 outline-none focus:border-amber-400 transition-all"
                      autoFocus
                    />
                    <button type="submit" className="bg-blue-600 text-white font-black px-12 py-4 rounded-2xl text-xl shadow-lg hover:bg-blue-500 active:scale-95 transition-all">
                      ¡DISPARAR! ⚡
                    </button>
                  </form>
                </div>
              )}

              {/* PUZZLE GAME */}
              {config.type === GAME_TYPES.PUZZLE && (
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  {puzzlePieces.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => handlePuzzleClick(i)}
                      className="aspect-square bg-white border-4 border-amber-200 rounded-3xl text-6xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      {['📖', '🦒', '🌲', '🦁'][p]}
                    </button>
                  ))}
                </div>
              )}

              {/* MATCHER GAME */}
              {config.type === GAME_TYPES.MATCHER && 'left' in config && 'right' in config && (
                <div className="grid grid-cols-2 gap-12 w-full max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {(config as any).left.map((item: string, i: number) => (
                      <button 
                        key={i} 
                        disabled={matchedItems.includes(i)}
                        onClick={() => handleMatcherClick(i, false)}
                        className={`w-full p-5 rounded-2xl font-bold text-left border-4 transition-all ${
                          matchedItems.includes(i) ? 'bg-green-100 border-green-300 opacity-50' : 
                          selectedInColumn === i ? 'bg-amber-400 border-amber-200 text-white' : 'bg-white border-slate-100 hover:border-amber-200'
                        }`}
                      >
                        {item} {matchedItems.includes(i) && '✅'}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {(config as any).right.map((item: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => handleMatcherClick(i, true)}
                        className="w-full p-5 rounded-2xl font-bold text-left bg-white border-4 border-slate-100 hover:border-blue-400 transition-all shadow-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SHOOTER GAME */}
              {config.type === GAME_TYPES.SHOOTER && 'options' in config && (
                <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
                  {(config as any).options.map((opt: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => handleShooterClick(i)}
                      className="p-8 rounded-[2rem] bg-white border-4 border-slate-100 hover:bg-red-50 hover:border-red-400 text-2xl font-black text-slate-700 shadow-xl transition-all active:scale-90"
                    >
                      🎯 {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center animate-fadeIn py-10">
               <div className="text-9xl mb-8">🏆</div>
               <h3 className="text-5xl font-black text-slate-800 mb-2">¡SÚPER MISIÓN!</h3>
               <p className="text-slate-500 font-bold text-xl uppercase tracking-widest mb-10">Ganaste {score} puntos de experiencia</p>
               <button 
                onClick={onFinish}
                className="bg-green-600 hover:bg-green-500 text-white font-black px-16 py-6 rounded-[3rem] text-3xl shadow-2xl active:scale-95 border-b-8 border-green-800"
              >
                ¡CONTINUAR! 🐾
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectGame;
