
import React, { useState, useEffect, useRef } from 'react';
import { TopicBlock, SubjectId } from '../types';
import { textToSpeech } from '../services/gemini';

interface SubjectGameProps {
  topic: TopicBlock | null;
  subjectId: SubjectId;
  onFinish: (score: number) => void;
}

interface Question {
  q: string;
  options?: string[];
  correct: number | string;
  visual?: string; // For math specific visual aids
  icon?: string;   // For general question icons
}

interface MatchItem {
  id: string;
  text: string;
  matchId: string;
}

interface GeoLimit {
  direction: string;
  limit: string;
  id: string;
}

interface HistoryArtifact {
  id: string;
  name: string;
  culture: 'Olmeca' | 'Maya' | 'Azteca';
  icon: string;
}

const SubjectGame: React.FC<SubjectGameProps> = ({ topic, subjectId, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'success' | 'error' | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // States for keyboard game
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // States for matching game (Science Block 1)
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]); // matched ids

  // States for Geography Game (Block 1)
  const [selectedGeoDir, setSelectedGeoDir] = useState<string | null>(null);
  const [geoMatches, setGeoMatches] = useState<string[]>([]);

  // States for History Game (Block 1)
  const [historyMatches, setHistoryMatches] = useState<string[]>([]); // ids of sorted artifacts
  const [currentArtifactIdx, setCurrentArtifactIdx] = useState(0);

  const isMathBlock1 = subjectId === 'math' && topic?.id === 'm1';
  const isScienceBlock1 = subjectId === 'science' && topic?.id === 's1';
  const isGeographyBlock1 = subjectId === 'geography' && topic?.id === 'g1';
  const isHistoryBlock1 = subjectId === 'history' && topic?.id === 'h1';
  
  const isUnderConstruction = topic?.id.match(/[2-5]$/);

  // Data for History Artifact Sorting
  const historyArtifacts: HistoryArtifact[] = [
    { id: 'h_a1', name: 'Cabezas Gigantes de Piedra', culture: 'Olmeca', icon: '🗿' },
    { id: 'h_a2', name: 'Calendario Solar Preciso', culture: 'Maya', icon: '☀️' },
    { id: 'h_a3', name: 'La Gran Tenochtitlan', culture: 'Azteca', icon: '🏙️' },
    { id: 'h_a4', name: 'Considerada "Cultura Madre"', culture: 'Olmeca', icon: '🤱' },
    { id: 'h_a5', name: 'Pirámide de Chichén Itzá', culture: 'Maya', icon: '🏛️' },
    { id: 'h_a6', name: 'Guerreros Águila y Jaguar', culture: 'Azteca', icon: '🦅' },
    { id: 'h_a7', name: 'Esculturas de Jaguares', culture: 'Olmeca', icon: '🐆' },
    { id: 'h_a8', name: 'Escritura con Glifos', culture: 'Maya', icon: '📜' },
    { id: 'h_a9', name: 'Chinampas (Huertos flotantes)', culture: 'Azteca', icon: '🛶' },
  ];

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioData = await textToSpeech(text);
    if (audioData) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleHistoryChestClick = (culture: string) => {
    if (showFeedback || isFinished) return;

    const currentArtifact = historyArtifacts[currentArtifactIdx];
    if (currentArtifact.culture === culture) {
      setShowFeedback('success');
      setScore(s => s + 20);
      setHistoryMatches(prev => [...prev, currentArtifact.id]);
      
      setTimeout(() => {
        if (currentArtifactIdx < historyArtifacts.length - 1) {
          setCurrentArtifactIdx(prev => prev + 1);
          setShowFeedback(null);
        } else {
          setIsFinished(true);
        }
      }, 1000);
    } else {
      setShowFeedback('error');
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  const handleGeoClick = (limitName: string) => {
    if (!selectedGeoDir || showFeedback) return;

    const correctLimit = geoLimits.find(l => l.id === selectedGeoDir)?.limit;
    
    if (limitName === correctLimit) {
      setGeoMatches(prev => [...prev, selectedGeoDir!]);
      setShowFeedback('success');
      setScore(s => s + 25);
      setSelectedGeoDir(null);
      if (geoMatches.length + 1 === geoLimits.length) {
        setTimeout(() => setIsFinished(true), 1500);
      }
    } else {
      setShowFeedback('error');
    }

    setTimeout(() => setShowFeedback(null), 1000);
  };

  const geoLimits: GeoLimit[] = [
    { id: 'n', direction: 'Norte ⬆️', limit: 'Estados Unidos' },
    { id: 's', direction: 'Sur ⬇️', limit: 'Guatemala y Belice' },
    { id: 'e', direction: 'Este ➡️', limit: 'Golfo de México y Mar Caribe' },
    { id: 'o', direction: 'Oeste ⬅️', limit: 'Océano Pacífico' },
  ];

  const leftItems: MatchItem[] = [
    { id: 'l1', text: 'Vacunas 💉', matchId: 'r1' },
    { id: 'l2', text: 'Corazón ❤️', matchId: 'r2' },
    { id: 'l3', text: 'Pulmones 🫁', matchId: 'r3' },
    { id: 'l4', text: 'Lavarse las manos 🧼', matchId: 'r4' },
    { id: 'l5', text: 'Sistema Inmune 🛡️', matchId: 'r5' },
  ];

  const rightItems: MatchItem[] = [
    { id: 'r2', text: 'Bombea sangre a todo el cuerpo', matchId: 'l2' },
    { id: 'r5', text: 'Defensa natural contra gérmenes', matchId: 'l5' },
    { id: 'r1', text: 'Nos protegen de enfermedades graves', matchId: 'l1' },
    { id: 'r4', text: 'Elimina virus y bacterias', matchId: 'l4' },
    { id: 'r3', text: 'Órganos para poder respirar', matchId: 'l3' },
  ];

  const handleMatchClick = (id: string, side: 'left' | 'right') => {
    if (showFeedback) return;

    if (side === 'left') {
      if (matches.includes(id)) return;
      setSelectedLeft(id);
      if (selectedRight) {
        checkMatch(id, selectedRight);
      }
    } else {
      const item = rightItems.find(i => i.id === id);
      if (item && matches.includes(item.matchId)) return;
      setSelectedRight(id);
      if (selectedLeft) {
        checkMatch(selectedLeft, id);
      }
    }
  };

  const checkMatch = (lId: string, rId: string) => {
    const leftItem = leftItems.find(i => i.id === lId);
    if (leftItem?.matchId === rId) {
      setMatches(prev => [...prev, lId]);
      setShowFeedback('success');
      setScore(s => s + 20);
      setSelectedLeft(null);
      setSelectedRight(null);
      
      if (matches.length + 1 === leftItems.length) {
        setTimeout(() => setIsFinished(true), 1500);
      }
    } else {
      setShowFeedback('error');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setShowFeedback(null);
      }, 1000);
    }
    
    if (leftItem?.matchId === rId) {
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  const getQuestions = (): Question[] => {
    if (isScienceBlock1 || isGeographyBlock1 || isHistoryBlock1 || isUnderConstruction) return [];

    const mathBlock1Questions: Question[] = [
      { q: "¿Cómo se llama el número de arriba en una fracción?", correct: "numerador", visual: "🍕", icon: "🔢" },
      { q: "¿Cómo se llama el número de abajo en una fracción?", correct: "denominador", visual: "🍰", icon: "📏" },
      { q: "Si divido un entero en 2 partes iguales, ¿qué fracción es cada una?", correct: "1/2", visual: "🍎", icon: "✂️" },
      { q: "En la fracción 3/4, ¿cuál es el numerador?", correct: "3", visual: "🔢", icon: "🔦" },
      { q: "Si tengo 4/4 de un pastel, ¿cuántos pasteles enteros tengo?", correct: "1", visual: "🎂", icon: "🍰" },
      { q: "¿Qué es mayor, 1/2 o 1/4?", correct: "1/2", visual: "📏", icon: "⚖️" },
      { q: "¿Cuántos medios forman un entero?", correct: "2", visual: "🍐", icon: "🧩" },
      { q: "Si divido algo en 4 partes, ¿cómo se llama cada una?", correct: "un cuarto", visual: "🍫", icon: "🔲" },
      { q: "En la fracción 5/8, ¿cuál es el denominador?", correct: "8", visual: "🍒", icon: "🔍" },
      { q: "¿Cómo se escribe 'tres quintos' en números?", correct: "3/5", visual: "🖍️", icon: "✏️" },
    ];

    const questionsMap: Record<SubjectId, Question[]> = {
      math: isMathBlock1 ? mathBlock1Questions : [
        { q: "¿Cuánto es 150 + 250?", options: ["300", "400", "350", "450"], correct: 1, icon: "➕" },
        { q: "¿Cuál es el resultado de 8 x 7?", options: ["48", "54", "56", "64"], correct: 2, icon: "✖️" },
        { q: "Si tengo 1/2 pizza y me dan otro 1/2, ¿cuánto tengo?", options: ["1/4", "1 entera", "2/2", "3/4"], correct: 1, icon: "🍕" },
        { q: "¿Cuál es el valor del número 5 en 5,432?", options: ["50", "500", "5,000", "5"], correct: 2, icon: "🏢" },
        { q: "¿Cuántos lados tiene un pentágono?", options: ["4", "5", "6", "8"], correct: 1, icon: "⬠" },
        { q: "¿Cuánto es la mitad de 1000?", options: ["250", "400", "500", "600"], correct: 2, icon: "🌓" },
        { q: "¿Qué número sigue en la serie: 2, 4, 8, 16...?", options: ["20", "24", "30", "32"], correct: 3, icon: "📈" },
        { q: "¿Cómo se llama el ángulo de 90 grados?", options: ["Agudo", "Obtuso", "Recto", "Llano"], correct: 2, icon: "📐" },
        { q: "¿Cuánto es 100 - 45?", options: ["45", "55", "65", "35"], correct: 1, icon: "➖" },
        { q: "¿Cuántos gramos tiene un kilogramo?", options: ["100g", "500g", "1000g", "1200g"], correct: 2, icon: "⚖️" },
      ],
      language: [
        { q: "¿Cómo se llama el inicio de un cuento?", options: ["Final", "Nudo", "Planteamiento", "Desenlace"], correct: 2, icon: "📖" },
        { q: "¿Cuál es un sinónimo de 'Feliz'?", options: ["Triste", "Enojado", "Contento", "Rápido"], correct: 2, icon: "😊" },
        { q: "¿Qué signo se usa para hacer una pregunta?", options: ["!", "?", ".", ","], correct: 1, icon: "❓" },
        { q: "¿Cuál es el sujeto en: 'El perro corre en el parque'?", options: ["El perro", "corre", "en el parque", "parque"], correct: 0, icon: "🐕" },
        { q: "¿Qué tipo de texto nos da información real?", options: ["Cuento", "Poema", "Informativo", "Leyenda"], correct: 2, icon: "📰" },
        { q: "¿Cuál es una palabra aguda?", options: ["Árbol", "Ratón", "Mesa", "Lápiz"], correct: 1, icon: "🐭" },
        { q: "¿Cómo se llaman las palabras que significan lo opuesto?", options: ["Sinónimos", "Antónimos", "Rimas", "Verbos"], correct: 1, icon: "☯️" },
        { q: "¿Qué parte del libro nos dice de qué trata?", options: ["Lomo", "Portada", "Índice", "Contraportada"], correct: 1, icon: "📘" },
        { q: "¿Qué es una rima?", options: ["Palabras largas", "Sonidos iguales al final", "Historias de risa", "Dibujos"], correct: 1, icon: "🎵" },
        { q: "¿Cuál es un verbo?", options: ["Saltar", "Pelota", "Azul", "Ayer"], correct: 0, icon: "🏃" },
      ],
      science: [],
      history: [],
      geography: [],
      civics: [
        { q: "¿Qué es un derecho de los niños?", options: ["Trabajar", "Ir a la escuela", "No comer", "Estar solos"], correct: 1, icon: "🎒" },
        { q: "¿Qué valor significa decir la verdad?", options: ["Respeto", "Justicia", "Honestidad", "Paz"], correct: 2, icon: "✨" },
        { q: "¿Quiénes deben cuidar el medio ambiente?", options: ["Solo los niños", "Solo los maestros", "Todos nosotros", "Nadie"], correct: 2, icon: "🌍" },
        { q: "¿Cómo resolvemos un conflicto sin pelear?", options: ["Gritando", "Dialogando", "Ignorando", "Corriendo"], correct: 1, icon: "🤝" },
        { q: "¿Qué documento contiene las leyes de México?", options: ["Diccionario", "Constitución", "Libro de texto", "Periódico"], correct: 1, icon: "📜" },
        { q: "¿Qué es la democracia?", options: ["Que uno manda", "Poder elegir", "No participar", "Pelear"], correct: 1, icon: "🗳️" },
        { q: "¿Cuál es un símbolo patrio?", options: ["Un juguete", "La Bandera", "Un dulce", "Un zapato"], correct: 1, icon: "🇲🇽" },
        { q: "¿Qué significa la igualdad de género?", options: ["Los niños son mejores", "Las niñas son mejores", "Valemos lo mismo", "No importa"], correct: 2, icon: "👫" },
        { q: "¿A quién debemos pedir ayuda si estamos en peligro?", options: ["A un extraño", "A un adulto de confianza", "A nadie", "Al perro"], correct: 1, icon: "🆘" },
        { q: "¿Por qué es importante seguir reglas?", options: ["Para aburrirnos", "Para convivir mejor", "Para pelear", "Para nada"], correct: 1, icon: "🚦" },
      ]
    };
    return questionsMap[subjectId] || [];
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentIdx];

  useEffect(() => {
    if (isMathBlock1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIdx, isMathBlock1]);

  const handleKeyboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || showFeedback) return;
    const isCorrect = userInput.trim().toLowerCase() === String(currentQuestion.correct).toLowerCase();
    if (isCorrect) {
      setShowFeedback('success');
      setScore(s => s + 10);
    } else {
      setShowFeedback('error');
    }
    setTimeout(() => {
      setShowFeedback(null);
      setUserInput('');
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  const handleOptionClick = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correct) {
      setShowFeedback('success');
      setScore(s => s + 10);
    } else {
      setShowFeedback('error');
    }
    setTimeout(() => {
      setShowFeedback(null);
      setSelectedOption(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  const progress = isScienceBlock1 
    ? (matches.length / leftItems.length) * 100 
    : isGeographyBlock1 
      ? (geoMatches.length / geoLimits.length) * 100 
      : isHistoryBlock1
        ? (historyMatches.length / historyArtifacts.length) * 100
        : ((currentIdx + 1) / questions.length) * 100;

  if (isUnderConstruction) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
        <div className="bg-white rounded-[3rem] shadow-2xl p-16 text-center border-[12px] border-amber-500">
          <div className="text-[10rem] mb-10">⚠️</div>
          <h2 className="text-5xl font-black text-slate-800 mb-8 uppercase tracking-tighter">SITIO EN CONSTRUCCIÓN</h2>
          <button 
            onClick={() => onFinish(0)}
            className="flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white font-black px-16 py-6 rounded-[3rem] text-2xl shadow-2xl active:scale-95 border-b-8 border-amber-800 transition-all mx-auto"
          >
            VOLVER AL CAMPAMENTO 🏕️
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const finalScore = isMathBlock1 || (!isScienceBlock1 && !isGeographyBlock1 && !isHistoryBlock1) 
      ? (score / (questions.length * 10)) * 100 
      : isScienceBlock1 
        ? (matches.length / leftItems.length) * 100
        : isGeographyBlock1
          ? (geoMatches.length / geoLimits.length) * 100
          : (historyMatches.length / historyArtifacts.length) * 100;

    return (
      <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
        <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border-[12px] border-green-500">
          <div className="text-9xl mb-6">🌟</div>
          <h2 className="text-5xl font-black text-slate-800 mb-4 uppercase">¡LO HICISTE MUY BIEN!</h2>
          <p className="text-2xl font-bold text-slate-500 mb-8 uppercase tracking-widest">
            ¡Eres un explorador increíble! Has terminado esta misión con éxito.
          </p>
          <button 
            onClick={() => onFinish(Math.round(finalScore))}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black px-16 py-6 rounded-[3rem] text-3xl shadow-2xl active:scale-95 border-b-8 border-green-800 transition-all mx-auto"
          >
            ¡CONTINUAR! 🐾
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className={`bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] ${isMathBlock1 ? 'border-purple-500' : isScienceBlock1 ? 'border-emerald-500' : isGeographyBlock1 ? 'border-cyan-500' : isHistoryBlock1 ? 'border-amber-700' : 'border-amber-400'} min-h-[75vh] flex flex-col`}>
        
        <div className={`${isMathBlock1 ? 'bg-purple-500' : isScienceBlock1 ? 'bg-emerald-500' : isGeographyBlock1 ? 'bg-cyan-500' : isHistoryBlock1 ? 'bg-amber-700' : 'bg-amber-400'} p-6`}>
          <div className={`flex justify-between items-center mb-4 ${isMathBlock1 || isScienceBlock1 || isGeographyBlock1 || isHistoryBlock1 ? 'text-white' : 'text-amber-900'} font-black uppercase tracking-tighter`}>
            <span className="text-xl">Misión: {topic?.title}</span>
            <span className="text-2xl">{isScienceBlock1 ? 'Relaciona Columnas' : isGeographyBlock1 ? 'Brújula de Fronteras' : isHistoryBlock1 ? 'Hallazgos Ancestrales' : `Pregunta ${currentIdx + 1}/10`}</span>
          </div>
          <div className={`w-full ${isMathBlock1 ? 'bg-purple-300' : isScienceBlock1 ? 'bg-emerald-300' : isGeographyBlock1 ? 'bg-cyan-300' : isHistoryBlock1 ? 'bg-amber-900/30' : 'bg-amber-200'} h-6 rounded-full overflow-hidden border-4 border-black/10`}>
            <div 
              className="bg-green-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col justify-center relative">
          
          <button 
            onClick={() => handleSpeak(currentQuestion?.q || "¡Escucha la instrucción!")}
            disabled={isSpeaking}
            className={`absolute top-4 right-4 p-4 rounded-full bg-slate-100 border-4 border-slate-200 shadow-lg active:scale-95 transition-all text-3xl ${isSpeaking ? 'opacity-50 grayscale' : 'hover:bg-amber-100 hover:border-amber-400'}`}
          >
            {isSpeaking ? '🔊' : '🔈'}
          </button>

          {showFeedback === 'success' && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-500/10 backdrop-blur-sm">
                <div className="text-[10rem] animate-bounce">🌟</div>
             </div>
          )}
          {showFeedback === 'error' && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-500/10 backdrop-blur-sm">
                <div className="text-[10rem] animate-pulse">❌</div>
             </div>
          )}

          {isHistoryBlock1 ? (
            <div className="flex flex-col items-center gap-10">
               <div className="text-center">
                 <h3 className="text-3xl font-black text-amber-800 uppercase mb-2">Descubrimiento Arqueológico 🗿</h3>
                 <p className="text-amber-600/70 font-bold">¡Guarda el hallazgo en el cofre de la civilización correcta!</p>
               </div>

               <div className="bg-amber-50 p-10 rounded-[2.5rem] border-4 border-dashed border-amber-200 w-full max-w-lg text-center shadow-inner relative">
                 <div className="text-[7rem] mb-4">
                    {historyArtifacts[currentArtifactIdx].icon}
                 </div>
                 <h4 className="text-2xl font-black text-amber-900 uppercase">
                    {historyArtifacts[currentArtifactIdx].name}
                 </h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
                 {['Olmeca', 'Maya', 'Azteca'].map((culture) => (
                    <button
                      key={culture}
                      onClick={() => handleHistoryChestClick(culture)}
                      className="group relative flex flex-col items-center justify-center transition-all active:scale-90"
                    >
                      <div className={`w-32 h-12 rounded-t-[3rem] border-4 border-b-0 transition-all ${
                        culture === 'Olmeca' ? 'bg-stone-500 border-stone-700' :
                        culture === 'Maya' ? 'bg-amber-700 border-amber-900' :
                        'bg-orange-800 border-orange-950'
                      } group-hover:-translate-y-2`}></div>
                      
                      <div className={`w-32 h-24 rounded-b-2xl border-4 flex flex-col items-center justify-center shadow-xl transition-all ${
                        culture === 'Olmeca' ? 'bg-stone-400 border-stone-700' :
                        culture === 'Maya' ? 'bg-amber-600 border-amber-900' :
                        'bg-orange-700 border-orange-950'
                      } group-hover:shadow-2xl`}>
                        <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 mb-1 shadow-inner"></div>
                        <span className="font-black text-white uppercase tracking-tighter text-sm drop-shadow-md">{culture}</span>
                      </div>

                      <div className="absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity text-xl">✨</div>
                    </button>
                 ))}
               </div>
            </div>
          ) : isGeographyBlock1 ? (
            <div className="flex flex-col items-center gap-12">
              <div className="text-center">
                <h3 className="text-3xl font-black text-cyan-800 uppercase mb-4">¿Con qué limita México? 🗺️</h3>
                <p className="text-slate-500 font-bold">Selecciona una dirección y luego su límite correspondiente</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                <div className="grid grid-cols-3 gap-4 h-64 w-64 mx-auto relative">
                  <div className="col-start-2">
                    <button 
                      onClick={() => setSelectedGeoDir('n')}
                      disabled={geoMatches.includes('n')}
                      className={`w-full h-full rounded-2xl flex items-center justify-center font-black border-4 transition-all ${
                        geoMatches.includes('n') ? 'bg-green-100 border-green-500 opacity-50' : 
                        selectedGeoDir === 'n' ? 'bg-cyan-500 border-white text-white scale-110 shadow-xl' : 'bg-white border-cyan-100 text-cyan-600'
                      }`}
                    >N</button>
                  </div>
                  <div className="row-start-2 col-start-1">
                    <button 
                      onClick={() => setSelectedGeoDir('o')}
                      disabled={geoMatches.includes('o')}
                      className={`w-full h-full rounded-2xl flex items-center justify-center font-black border-4 transition-all ${
                        geoMatches.includes('o') ? 'bg-green-100 border-green-500 opacity-50' : 
                        selectedGeoDir === 'o' ? 'bg-cyan-500 border-white text-white scale-110 shadow-xl' : 'bg-white border-cyan-100 text-cyan-600'
                      }`}
                    >O</button>
                  </div>
                  <div className="row-start-2 col-start-2 flex items-center justify-center">
                    <div className="text-4xl">🇲🇽</div>
                  </div>
                  <div className="row-start-2 col-start-3">
                    <button 
                      onClick={() => setSelectedGeoDir('e')}
                      disabled={geoMatches.includes('e')}
                      className={`w-full h-full rounded-2xl flex items-center justify-center font-black border-4 transition-all ${
                        geoMatches.includes('e') ? 'bg-green-100 border-green-500 opacity-50' : 
                        selectedGeoDir === 'e' ? 'bg-cyan-500 border-white text-white scale-110 shadow-xl' : 'bg-white border-cyan-100 text-cyan-600'
                      }`}
                    >E</button>
                  </div>
                  <div className="row-start-3 col-start-2">
                    <button 
                      onClick={() => setSelectedGeoDir('s')}
                      disabled={geoMatches.includes('s')}
                      className={`w-full h-full rounded-2xl flex items-center justify-center font-black border-4 transition-all ${
                        geoMatches.includes('s') ? 'bg-green-100 border-green-500 opacity-50' : 
                        selectedGeoDir === 's' ? 'bg-cyan-500 border-white text-white scale-110 shadow-xl' : 'bg-white border-cyan-100 text-cyan-600'
                      }`}
                    >S</button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {['Estados Unidos', 'Guatemala y Belice', 'Océano Pacífico', 'Golfo de México y Mar Caribe'].sort().map(limit => (
                    <button
                      key={limit}
                      onClick={() => handleGeoClick(limit)}
                      disabled={!selectedGeoDir || geoMatches.some(m => geoLimits.find(l => l.id === m)?.limit === limit)}
                      className={`p-4 rounded-2xl border-4 font-black text-center transition-all shadow-md ${
                        geoMatches.some(m => geoLimits.find(l => l.id === m)?.limit === limit)
                          ? 'bg-green-100 border-green-500 text-green-700 opacity-50'
                          : !selectedGeoDir ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      {limit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isScienceBlock1 ? (
            <div className="grid grid-cols-2 gap-12">
              <div className="flex flex-col gap-4">
                <p className="text-center font-black text-emerald-800 uppercase tracking-widest text-sm mb-4">Conceptos</p>
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleMatchClick(item.id, 'left')}
                    className={`
                      p-5 text-xl font-black rounded-2xl border-4 transition-all text-center justify-center shadow-md flex items-center min-h-[5.5rem]
                      ${matches.includes(item.id) ? 'bg-emerald-100 border-emerald-500 text-emerald-700 opacity-50 cursor-default' : 
                        selectedLeft === item.id ? 'bg-emerald-500 border-white text-white scale-105 shadow-xl' : 'bg-white border-slate-100 hover:border-emerald-400 text-slate-700'
                      }
                    `}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-center font-black text-emerald-800 uppercase tracking-widest text-sm mb-4">Definiciones</p>
                {rightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleMatchClick(item.id, 'right')}
                    className={`
                      p-5 text-lg font-bold rounded-2xl border-4 transition-all text-center justify-center shadow-md flex items-center min-h-[5.5rem]
                      ${matches.includes(item.matchId) ? 'bg-emerald-100 border-emerald-500 text-emerald-700 opacity-50 cursor-default' : 
                        selectedRight === item.id ? 'bg-emerald-500 border-white text-white scale-105 shadow-xl' : 'bg-white border-slate-100 hover:border-emerald-400 text-slate-700'
                      }
                    `}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          ) : isMathBlock1 ? (
            <div className="flex flex-col items-center">
              <div className="text-center mb-10">
                {currentQuestion?.icon && (
                  <div className="text-[6rem] mb-4">{currentQuestion.icon}</div>
                )}
                {currentQuestion?.visual && (
                  <div className="text-8xl mb-6">{currentQuestion.visual}</div>
                )}
                <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                  {currentQuestion?.q}
                </h3>
              </div>
              <form onSubmit={handleKeyboardSubmit} className="flex flex-col items-center gap-6 w-full max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="w-full px-8 py-6 text-4xl font-black text-center text-purple-600 bg-purple-50 border-8 border-purple-200 rounded-[2.5rem] outline-none focus:border-purple-500 transition-all shadow-inner"
                  disabled={showFeedback !== null}
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black px-12 py-5 rounded-3xl text-2xl shadow-xl active:scale-95 transition-all border-b-8 border-purple-800"
                  disabled={showFeedback !== null || !userInput.trim()}
                >
                  ¡RESPONDER! ⌨️
                </button>
                <p className="text-purple-400 font-bold animate-pulse">¡Presiona ENTER para enviar!</p>
              </form>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="text-center mb-12">
                {currentQuestion?.icon && (
                  <div className="text-[7rem] mb-6">{currentQuestion.icon}</div>
                )}
                <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                  {currentQuestion?.q}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestion?.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={showFeedback !== null}
                    className={`
                      p-6 text-2xl font-black rounded-[2rem] border-4 transition-all active:scale-95 text-left flex items-center gap-4
                      ${selectedOption === i 
                        ? (i === currentQuestion.correct ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700')
                        : 'bg-white border-slate-100 hover:border-amber-400 hover:bg-amber-50 text-slate-700 shadow-lg'
                      }
                      ${showFeedback && i === currentQuestion.correct ? 'bg-green-100 border-green-500' : ''}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shrink-0 ${
                      selectedOption === i ? 'border-current' : 'border-slate-100 bg-slate-50'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {isHistoryBlock1 ? "¡Organiza los hallazgos en los cofres de las civilizaciones! 🏛️" : isGeographyBlock1 ? "¡Usa la brújula para señalar los límites de nuestra nación! 🧭" : isScienceBlock1 ? "¡Relaciona cada concepto con su significado de expedición! 🔬" : isMathBlock1 ? "¡Usa tu teclado para demostrar cuánto sabes de fracciones! 🦒" : "Sigue adelante explorador, cada respuesta te hace más sabio 🦁"}
            </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectGame;
