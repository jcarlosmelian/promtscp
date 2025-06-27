import React, { useState } from 'react';
import Button from './Button';
import { ConstitutionalPrinciple } from '../types';

interface ConstitutionalAIStageProps {
  principles: ConstitutionalPrinciple[];
  onComplete: () => void;
}

const ConstitutionalAIStage: React.FC<ConstitutionalAIStageProps> = ({ principles, onComplete }) => {
  const [currentPrincipleIndex, setCurrentPrincipleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'adherence' | 'violation' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentPrinciple = principles[currentPrincipleIndex];

  const handleAnswer = (answer: 'adherence' | 'violation') => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleNextPrinciple = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentPrincipleIndex < principles.length - 1) {
      setCurrentPrincipleIndex(currentPrincipleIndex + 1);
    } else {
      onComplete();
    }
  };

  if (!currentPrinciple) {
    return <div>Cargando principios...</div>;
  }
  
  // For simplicity, we'll present one scenario (violation) and ask to identify it.
  // A more complex game might mix adherence/violation examples.
  const scenarioIsViolation = true; 
  const scenarioText = currentPrinciple.exampleViolation;
  const correctChoice = 'violation';


  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-slate-700/50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-sky-400">Principio: {currentPrinciple.name}</h2>
      <p className="text-slate-300">{currentPrinciple.description}</p>

      <div className="my-4 p-4 bg-slate-600 rounded-md">
        <p className="text-sm text-slate-300 mb-1 font-semibold">Considera este escenario:</p>
        <p className="text-slate-100 italic">"{scenarioText}"</p>
      </div>

      {!showFeedback && (
        <div className="space-y-3">
            <p className="text-slate-200">¿Este escenario demuestra principalmente una adhesión o una violación del principio de <span className="font-bold">{currentPrinciple.name}</span>?</p>
          <Button onClick={() => handleAnswer('adherence')} className="w-full">Demuestra Adhesión</Button>
          <Button onClick={() => handleAnswer('violation')} variant="secondary" className="w-full">Demuestra Violación</Button>
        </div>
      )}

      {showFeedback && selectedAnswer && (
        <div className={`mt-4 p-3 rounded-md text-sm ${selectedAnswer === correctChoice ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
          {selectedAnswer === correctChoice ? (
            <p>¡Correcto! Este escenario efectivamente resalta una violación de {currentPrinciple.name}.</p>
          ) : (
            <p>No exactamente. Este escenario en realidad muestra una violación. El principio de {currentPrinciple.name} significa: {currentPrinciple.description}</p>
          )}
          <p className="mt-2 pt-2 border-t border-slate-500 text-slate-200">
            <strong>Ejemplo de Adhesión:</strong> "{currentPrinciple.exampleAdherence}"
          </p>
          <Button onClick={handleNextPrinciple} className="w-full mt-4">
            {currentPrincipleIndex < principles.length - 1 ? 'Siguiente Principio' : '¡Principios Entendidos!'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConstitutionalAIStage;