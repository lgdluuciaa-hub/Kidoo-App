
import { GoogleGenAI, Modality } from "@google/genai";

export const getThinkingResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un simpático guía de la selva llamado 'Kidoo'. Tu objetivo es ayudar a niños de 9-10 años (4to de primaria) con sus preguntas escolares. Responde de forma divertida, usa analogías de animales y naturaleza. Usa emojis de selva (🌿, 🦁, 🐒, 🦜) y mantén las respuestas breves y claras.",
        temperature: 0.7,
      },
    });
    return response.text || "¡Caracoles! Mi brújula se perdió. ¿Podrías preguntar de nuevo?";
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Lo siento, amiguito. Se cortaron las lianas de comunicación.";
  }
};

export const generateArt = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Dibujo estilo caricatura vibrante para niños, tema de selva y animales, muy colorido y alegre de: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const searchKnowledge = async (query: string): Promise<{text: string, sources: any[]}> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explícame esto como si fuéramos en una expedición por la selva para niños de 4to grado: ${query}`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error in knowledge search:", error);
    return { text: "No pude encontrar el rastro en mis libros de expedición.", sources: [] };
  }
};

export const textToSpeech = async (text: string): Promise<Uint8Array | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lee esto con voz amigable y entusiasta para un niño: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return null;
  } catch (error) {
    console.error("Error in TTS:", error);
    return null;
  }
};
