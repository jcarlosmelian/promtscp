import React, { useState } from 'react';
import Button from './Button';
import { BASIC_PROMPT_EXAMPLE } from '../constants'; // Assuming this is defined

interface BasicPromptStageProps {
  onComplete: () => void;
}

const BasicPromptStage: React.FC<BasicPromptStageProps> = ({ onComplete }) => {
  const [showResponse, setShowResponse] = useState(false);

  const handleSimulate = () => {
    setShowResponse(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-slate-700/50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-sky-400 mb-4">Simulando un Prompt Básico</h2>
      
      <div className="p-4 bg-slate-600 rounded-md">
        <p className="text-sm text-slate-300 mb-1">Tu Prompt Básico:</p>
        <code className="text-slate-100 whitespace-pre-wrap">{BASIC_PROMPT_EXAMPLE.prompt}</code>
      </div>

      {!showResponse && (
        <Button onClick={handleSimulate} className="w-full">
          Simular Evaluación con IA
        </Button>
      )}

      {showResponse && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          <div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-md">
            <p className="text-sm text-yellow-300 mb-1">Respuesta Simulada de la IA:</p>
            <p className="text-yellow-100">{BASIC_PROMPT_EXAMPLE.aiResponse}</p>
          </div>
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-md">
            <p className="text-sm text-red-300 mb-1">Análisis del Problema:</p>
            <p className="text-red-100">{BASIC_PROMPT_EXAMPLE.problem}</p>
          </div>
          <Button onClick={onComplete} className="w-full mt-4">
            ¡Entendido, a mejorar!
          </Button>
        </div>
      )}
      {/* Fix: Removed <style jsx> block as it's not standard React and was causing errors.
          The 'animate-fadeIn' class is expected to be defined in Tailwind config or global CSS.
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style> */}
    </div>
  );
};

export default BasicPromptStage;