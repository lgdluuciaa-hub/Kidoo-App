
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SubjectId } from '../types';
import { getThinkingResponse } from '../services/gemini';

interface ThinkingLabProps {
  subjectId: SubjectId;
}

const ThinkingLab: React.FC<ThinkingLabProps> = ({ subjectId }) => {
  const getInitialMessage = () => {
    switch(subjectId) {
      case 'math': return "¡Hola genio de los números! 🔢 ¿Quieres practicar fracciones o resolver algún problema de geometría hoy?";
      case 'language': return "¡Hola gran lector! 📚 ¿En qué práctica de lectura o escritura te puedo ayudar hoy?";
      case 'science': return "¡Hola científico de la selva! 🧪 ¿Hablamos de nutrición, ecosistemas o electricidad?";
      case 'civics': return "¡Hola ciudadano ejemplar! ⚖️ ¿Quieres aprender sobre tus derechos o el cuidado ambiental?";
      default: return "¡Hola explorador! 🐒 Soy Kidoo. ¿En qué te puedo ayudar hoy?";
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: getInitialMessage() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const subjectContext = `El estudiante de 4to grado está en el módulo de ${subjectId}. `;
    const finalPrompt = `${subjectContext}Pregunta: ${userMsg}`;

    const response = await getThinkingResponse(finalPrompt);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const getSubjectColor = () => {
    switch(subjectId) {
      case 'math': return 'border-blue-600 bg-blue-600';
      case 'language': return 'border-red-500 bg-red-500';
      case 'science': return 'border-emerald-600 bg-emerald-600';
      case 'civics': return 'border-indigo-600 bg-indigo-600';
      default: return 'border-emerald-600 bg-emerald-600';
    }
  };

  const getSubjectIcon = () => {
    switch(subjectId) {
      case 'math': return '🔢';
      case 'language': return '📚';
      case 'science': return '🧪';
      case 'civics': return '⚖️';
      default: return '🐒';
    }
  };

  return (
    <div className={`max-w-4xl mx-auto h-[75vh] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] ${getSubjectColor().split(' ')[0]}`}>
      <div className={`${getSubjectColor().split(' ')[1]} p-6 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl text-4xl shadow-md">
            {getSubjectIcon()}
          </div>
          <div>
            <h2 className="text-white text-2xl font-black tracking-tight">Kidoo: {subjectId === 'civics' ? 'Cívica' : subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}</h2>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Tutor Personalizado</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-md text-lg leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-700 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border-4 border-slate-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border-4 border-slate-100 shadow-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t-8 border-slate-50 flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Pregunta sobre tu materia de ${subjectId}...`}
          className="flex-1 px-8 py-5 bg-slate-100 rounded-3xl outline-none focus:ring-4 ring-emerald-500/20 text-lg transition-all font-bold placeholder-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-600/40 active:scale-90 transition-all disabled:opacity-50"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ThinkingLab;
