
import React, { useState } from 'react';
import { generateArt } from '../services/gemini';

const ArtStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    const result = await generateArt(prompt);
    setImage(result);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-orange-500">
      <div className="bg-orange-500 p-10 text-center">
        <h2 className="text-white text-5xl font-black mb-3 tracking-tighter">Pintura Mágica 🎨</h2>
        <p className="text-orange-100 text-xl font-bold">¡Describe un animal loco y lo crearé!</p>
      </div>

      <div className="p-10 space-y-10 flex flex-col items-center bg-orange-50/30">
        <div className="w-full max-w-xl">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Un elefante con alas de mariposa..."
              className="flex-1 px-8 py-5 bg-white rounded-3xl border-4 border-orange-100 focus:border-orange-500 outline-none text-xl font-bold transition-all shadow-inner"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-5 rounded-3xl shadow-xl shadow-orange-600/40 active:scale-90 transition-all disabled:opacity-50"
            >
              {isGenerating ? '🎨...' : '¡Pintar! ✨'}
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-2xl aspect-square bg-white rounded-[3rem] border-8 border-dashed border-orange-200 flex items-center justify-center overflow-hidden shadow-2xl">
          {isGenerating ? (
            <div className="text-center">
              <div className="text-8xl animate-bounce mb-6">🐘</div>
              <p className="text-orange-600 font-black text-2xl animate-pulse">Mezclando colores de selva...</p>
            </div>
          ) : image ? (
            <img src={image} alt="Generado" className="w-full h-full object-cover animate-fadeIn" />
          ) : (
            <div className="text-center p-12">
              <div className="text-9xl mb-6 opacity-10">🐾</div>
              <p className="text-orange-300 font-black text-2xl">Aquí aparecerá tu creación salvaje</p>
            </div>
          )}
        </div>

        {image && (
          <div className="flex gap-6">
            <button 
               onClick={() => {
                 const link = document.createElement('a');
                 link.href = image;
                 link.download = 'mi-animal-magico.png';
                 link.click();
               }}
               className="bg-green-600 hover:bg-green-500 text-white font-black px-10 py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-3 text-lg"
            >
              <span>💾</span> Guardar Obra
            </button>
            <button 
               onClick={() => {
                 setImage(null);
                 setPrompt('');
               }}
               className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black px-10 py-5 rounded-2xl active:scale-95 transition-all text-lg"
            >
              Limpiar Lienzo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtStudio;
