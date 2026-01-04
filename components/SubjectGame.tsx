
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
} as const;

interface MathLevel { q: string; a: string; }
interface PuzzleLevel { pieces: number[]; solved: number[]; icon: string; }

interface BaseConfig {
  title: string;
  instruction: string;
}

interface MathConfig extends BaseConfig {
  type: typeof GAME_TYPES.MATH_INPUT;
  levels: MathLevel[];
}

interface PuzzleConfig extends BaseConfig {
  type: typeof GAME_TYPES.PUZZLE;
  levels: PuzzleLevel[];
}

interface MatcherConfig extends BaseConfig {
  type: typeof GAME_TYPES.MATCHER;
  left: string[];
  right: string[];
  pairs: Record<number, number>;
}

interface ShooterConfig extends BaseConfig {
  type: typeof GAME_TYPES.SHOOTER;
  options: string[];
  correct: number;
}

type GameConfig = MathConfig | PuzzleConfig | MatcherConfig | ShooterConfig;

const SubjectGame: React.FC<SubjectGameProps> = ({ topic, subjectId, onFinish }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [score, setScore] = useState(0);
  
  const [mathValue, setMathValue] = useState('');
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [matchedItems, setMatchedItems] = useState<number[]>([]);
  const [selectedInColumn, setSelectedInColumn] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const getGameConfig = (): GameConfig | null => {
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
        pairs: { 0: 3, 1: 2, 2: 1, 3: 0 }
      };
      case 'history': return {
        type: GAME_TYPES.MATCHER,
        title: 'Mesoamérica Antigua',
        instruction: 'Relaciona la cultura con su legado.',
        left: ['Olmecas', 'Mayas', 'Mexicas (Aztecas)', 'Zapotecas'],
        right: ['Gran Tenochtitlan', 'Cabezas Gigantes', 'Monte Albán', 'Calendario y Cero'],
        pairs: { 0: 1, 1: 3, 2: 0, 3: 2 }
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
    if (config?.type === GAME_TYPES.PUZZLE) {
      setPuzzlePieces(config.levels[0].pieces);
    }
    if (config?.type === GAME_TYPES.MATH_INPUT) {
      inputRef.current?.focus();
    }
  }, [subjectId, config]);

  if (!config) return null;

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.type === GAME_TYPES.MATH_INPUT) {
      if (mathValue === config.levels[currentLevel].a) {
        handleSuccess();
        setMathValue('');
      } else {
        handleError();
      }
    }
  };

  const handlePuzzleClick = (idx: number) => {
    if (config.type === GAME_TYPES.PUZZLE) {
      const newPieces = [...puzzlePieces];
      const nextIdx = (idx + 1) % puzzlePieces.length;
      [newPieces[idx], newPieces[nextIdx]] = [newPieces[nextIdx], newPieces[idx]];
      setPuzzlePieces(newPieces);
      
      if (JSON.stringify(newPieces) === JSON.stringify(config.levels[0].solved)) {
        handleSuccess();
      }
    }
  };

  const handleMatcherClick = (idx: number, isRight: boolean) => {
    if (config.type === GAME_TYPES.MATCHER) {
      if (!isRight) {
        setSelectedInColumn(idx);
      } else if (selectedInColumn !== null) {
        if (config.pairs[selectedInColumn] === idx) {
          const newMatched = [...matchedItems, selectedInColumn];
          setMatchedItems(newMatched);
          setSelectedInColumn(null);
          if (newMatched.length === config.left.length) {
            handleSuccess();
          }
        } else {
          handleError();
          setSelectedInColumn(null);
        }
      }
    }
  };

  const handleShooterClick = (idx: number) => {
    if (config.type === GAME_TYPES.SHOOTER) {
      if (idx === config.correct) {
        handleSuccess();
      } else {
        handleError();
      }
    }
  };

  const handleSuccess = () => {
    setFeedback('success');
    setScore(s => s + 20);
    setTimeout(() => {
      setFeedback(null);
      if (config.type === GAME_TYPES.MATH_INPUT && currentLevel < config.levels.length - 1) {
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
              {config.type === GAME_TYPES.MATH_INPUT && (
                <div className="text-center space-y-10">
                  <div className="text-7xl font-black text-blue-600 bg-white p-12 rounded-[3rem] shadow-xl inline-block border-8 border-blue-100">
                    {config.levels[currentLevel].q}
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

              {config.type === GAME_TYPES.MATCHER && (
                <div className="grid grid-cols-2 gap-12 w-full max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {config.left.map((item, i) => (
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
                    {config.right.map((item, i) => (
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

              {config.type === GAME_TYPES.SHOOTER && (
                <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
                  {config.options.map((opt, i) => (
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
