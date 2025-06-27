import React, { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { Offer, EvaluationResult, PromptChainingStep, PromptEnhancementChoice } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface PromptCraftingStageProps {
  offers: Offer[];
  steps: PromptChainingStep[];
  evaluationResults: { [offerId: number]: EvaluationResult };
  updateEvaluationResult: (offerId: number, partialResult: Partial<EvaluationResult>) => void;
  onCompleteStage: () => void;
}

const PromptCraftingStage: React.FC<PromptCraftingStageProps> = ({
  offers,
  steps,
  evaluationResults,
  updateEvaluationResult,
  onCompleteStage,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [selectedEnhancements, setSelectedEnhancements] = useState<Record<string, boolean>>({});
  const [showSimulationResult, setShowSimulationResult] = useState(false);
  const [simulationFeedback, setSimulationFeedback] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Ensure steps and offers are valid before trying to access them
  if (!steps || steps.length === 0 || !offers || offers.length === 0) {
    return <div className="p-4 text-red-400">Error: No se han cargado los pasos de creación de prompts o las ofertas.</div>;
  }
  
  const currentStep = steps[currentStepIndex];
  const currentOffer = offers[currentOfferIndex];

  if (!currentStep || !currentOffer) {
     return <div className="p-4 text-red-400">Error: Faltan datos del paso u oferta actual.</div>;
  }

  const resetForNewPrompt = useCallback(() => {
    setSelectedEnhancements({});
    setShowSimulationResult(false);
    setSimulationFeedback('');
  }, []);

  useEffect(() => {
    resetForNewPrompt();
  }, [currentStepIndex, currentOfferIndex, resetForNewPrompt]);

  const handleEnhancementToggle = (choiceId: string) => {
    setSelectedEnhancements(prev => ({ ...prev, [choiceId]: !prev[choiceId] }));
  };

  const simulateEvaluation = () => {
    setIsSimulating(true);
    // setShowSimulationResult(false); // Resetting here can cause a flicker if feedback is shown quickly

    // Simulate AI processing delay
    setTimeout(() => {
      let rationale = `Evaluación para ${currentOffer.name} usando el prompt para ${currentStep.name}: `;

      const goodChoicesMade = currentStep.enhancementChoices.filter(c => c.isGood && selectedEnhancements[c.id]).length;
      const badChoicesMade = currentStep.enhancementChoices.filter(c => !c.isGood && selectedEnhancements[c.id]).length;
      const totalGoodChoices = currentStep.enhancementChoices.filter(c => c.isGood).length;
      
      let promptQuality = totalGoodChoices > 0 ? (goodChoicesMade - badChoicesMade) / totalGoodChoices : 0.5; // Avoid division by zero, default to medium quality
      promptQuality = Math.max(0, Math.min(1, promptQuality)); // Clamp between 0 and 1

      switch (currentStep.id) {
        case 'admin_verification':
          if (currentOffer.adminDocsComplete && promptQuality > 0.5) {
            updateEvaluationResult(currentOffer.id, { administrativeCheck: 'APTO' });
            rationale += "La oferta es administrativamente APTA. Todos los documentos parecen completos según el prompt bien elaborado.";
          } else if (!currentOffer.adminDocsComplete && promptQuality > 0.5) {
            updateEvaluationResult(currentOffer.id, { administrativeCheck: 'NO APTO', issues: [...(evaluationResults[currentOffer.id]?.issues || []), 'Fallo en la comprobación administrativa: Documentos incompletos.'] });
             rationale += "La oferta es administrativamente NO APTA debido a documentos incompletos (identificado por un buen prompt).";
          } else { // Poor prompt quality or docs complete but prompt too bad to tell
            const existingIssues = evaluationResults[currentOffer.id]?.issues || [];
            updateEvaluationResult(currentOffer.id, { administrativeCheck: 'NO APTO', issues: [...existingIssues, 'Comprobación administrativa no concluyente debido a la mala calidad del prompt.'] });
            rationale += "La oferta es administrativamente NO APTA o el prompt fue insuficiente para una verificación clara. ";
            if(!currentOffer.adminDocsComplete) rationale += "La propia oferta tenía documentos administrativos incompletos.";
          }
          break;
        case 'technical_evaluation':
          let techScore = 0;
          let techRationaleSpecifics = "";
          if (evaluationResults[currentOffer.id]?.administrativeCheck === 'APTO') {
            if (currentOffer.technicalProposalStrength === 'strong') techScore = 50 + (promptQuality * 10);
            else if (currentOffer.technicalProposalStrength === 'average') techScore = 35 + (promptQuality * 10);
            else techScore = 20 + (promptQuality * 10);
            techScore = Math.min(60, Math.max(0, Math.round(techScore)));
            
            techRationaleSpecifics = `Fortaleza de la oferta: ${currentOffer.technicalProposalStrength}. `;
            if (promptQuality < 0.6) techRationaleSpecifics += "El prompt podría ser más específico, lo que podría llevar a una justificación menos detallada. ";
            else techRationaleSpecifics += "El prompt permitió una justificación clara de las puntuaciones. ";
            rationale += `Puntuación técnica: ${techScore}/60. ${techRationaleSpecifics}`;
          } else {
             rationale += "Evaluación técnica omitida ya que la oferta es NO APTA administrativamente.";
             techRationaleSpecifics = "Omitido por estado administrativo.";
          }
          updateEvaluationResult(currentOffer.id, { technicalScore: techScore, technicalRationale: techRationaleSpecifics.trim() });
          break;
        case 'economic_evaluation':
          let econScore = 0;
          let econRationaleSpecifics = "";
          if (evaluationResults[currentOffer.id]?.administrativeCheck === 'APTO') {
            const prices = offers
                .filter(o => evaluationResults[o.id]?.administrativeCheck === 'APTO' && o.id !== currentOffer.id) // Filter other APT offers
                .map(o => o.price);
            prices.push(currentOffer.price); // Add current offer's price to ensure it's considered if it's the only one
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : currentOffer.price;

            if (currentOffer.price > 0 && promptQuality > 0.3) {
              econScore = Math.round(40 * (lowestPrice / currentOffer.price));
              econScore = Math.min(40, Math.max(0, econScore));
              econRationaleSpecifics = `Basado en el precio más bajo de ${lowestPrice}€ y el precio de esta oferta de ${currentOffer.price}€. `;
              if(promptQuality < 0.7) econRationaleSpecifics += "La claridad del prompt podría afectar el cálculo preciso si se involucraran fórmulas complejas, pero se aplicó la fórmula básica. ";
              else econRationaleSpecifics += "El prompt soporta una aplicación clara de la fórmula. ";
              rationale += `Puntuación económica: ${econScore}/40. ${econRationaleSpecifics}`;
            } else {
              econRationaleSpecifics = "La puntuación falló debido a un precio cero, datos faltantes o una calidad de prompt muy baja para el cálculo. ";
              rationale += `Problema en la puntuación económica. ${econRationaleSpecifics}`;
            }
          } else {
            rationale += "Evaluación económica omitida ya que la oferta es NO APTA administrativamente.";
            econRationaleSpecifics = "Omitido por estado administrativo.";
          }
          updateEvaluationResult(currentOffer.id, { economicScore: econScore, economicRationale: econRationaleSpecifics.trim() });
          break;
        case 'final_synthesis':
          const tech = evaluationResults[currentOffer.id]?.technicalScore || 0;
          const econ = evaluationResults[currentOffer.id]?.economicScore || 0;
          const finalScore = evaluationResults[currentOffer.id]?.administrativeCheck === 'APTO' ? Math.round(tech + econ) : 0;
          rationale += `Puntuación final calculada como ${finalScore}/100. Calidad del prompt de síntesis: ${promptQuality > 0.7 ? 'Buena' : 'Necesita mejorar'}.`;
          if (evaluationResults[currentOffer.id]?.administrativeCheck !== 'APTO') {
            rationale += " La puntuación final es 0 por no ser APTA.";
          }
          updateEvaluationResult(currentOffer.id, { finalScore, issues: promptQuality < 0.5 ? ['La claridad de la síntesis podría mejorarse debido al prompt.'] : [] });
          break;
      }
      
      setSimulationFeedback(rationale);
      setShowSimulationResult(true);
      setIsSimulating(false);
    }, 700); // Simulate delay
  };

  const handleNext = () => {
    // State updates will trigger useEffect, which calls resetForNewPrompt.
    if (currentOfferIndex < offers.length - 1) {
      setCurrentOfferIndex(currentOfferIndex + 1);
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentOfferIndex(0); // Reset to the first offer for the new step
    } else {
      onCompleteStage(); // All steps and all offers for those steps are done
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-700/50 rounded-lg shadow-xl text-sm sm:text-base">
      <h2 className="text-xl sm:text-2xl font-bold text-sky-400">
        Paso {currentStepIndex + 1}/{steps.length}: {currentStep.name}
      </h2>
      <h3 className="text-lg sm:text-xl text-slate-200">
        Evaluando Oferta: <span className="font-semibold">{currentOffer.name}</span> <span className="text-xs text-slate-400">({currentOffer.description})</span>
      </h3>

      <div className="p-3 sm:p-4 bg-slate-600 rounded-md">
        <p className="text-xs sm:text-sm text-slate-300 mb-1">Prompt Base para esta Tarea:</p>
        <code className="text-slate-100 whitespace-pre-wrap text-xs sm:text-sm">{currentStep.basePrompt}</code>
        {currentStep.criteria && <p className="text-xs text-slate-400 mt-1">Criterios Clave: {currentStep.criteria}</p>}
        <p className="text-xs text-slate-400 mt-1">Ejemplo de Salida Esperada: {currentStep.outputFormatExample}</p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-md sm:text-lg font-semibold text-slate-100">Mejora el Prompt:</h4>
        {currentStep.enhancementChoices.map(choice => (
          <div key={choice.id} className="flex items-start sm:items-center p-2 bg-slate-800 rounded-md hover:bg-slate-700/70 transition-colors">
            <input
              type="checkbox"
              id={`${currentStep.id}-${choice.id}`}
              checked={!!selectedEnhancements[choice.id]}
              onChange={() => handleEnhancementToggle(choice.id)}
              className="mt-1 sm:mt-0 mr-2 sm:mr-3 h-4 w-4 rounded border-slate-500 text-sky-600 focus:ring-sky-500 bg-slate-700 cursor-pointer"
              aria-labelledby={`label-${currentStep.id}-${choice.id}`}
            />
            <label id={`label-${currentStep.id}-${choice.id}`} htmlFor={`${currentStep.id}-${choice.id}`} className="text-xs sm:text-sm text-slate-200 cursor-pointer flex-1">
              {choice.text}
              {!choice.isGood && selectedEnhancements[choice.id] && (
                <span className="block sm:inline text-xs text-yellow-400 ml-0 sm:ml-2">({choice.feedback || "Considera si esta es una opción óptima."})</span>
              )}
            </label>
          </div>
        ))}
      </div>
      
      {(currentStep.fewShotExamplesGood.length > 0 || currentStep.fewShotExamplesBad.length > 0) &&
        <details className="mt-3 sm:mt-4 p-2 sm:p-3 bg-slate-800/70 rounded group">
            <summary className="text-xs sm:text-md font-semibold text-sky-300 cursor-pointer hover:text-sky-200 transition-colors">
              Mostrar/Ocultar Guía: Ejemplos de Aprendizaje Few-Shot
            </summary>
            <div className="mt-2 space-y-1">
              {currentStep.fewShotExamplesGood.map(ex => (
                  <p key={ex.id} className="text-xs text-green-300 mb-1 p-1 bg-green-900/50 rounded">✓ Buen Ejemplo: {ex.text} {ex.points ? `(Ilustra un resultado de ${ex.points}pts)` : ''}</p>
              ))}
              {currentStep.fewShotExamplesBad.map(ex => (
                  <p key={ex.id} className="text-xs text-red-300 mb-1 p-1 bg-red-900/50 rounded">✗ Mal Ejemplo: {ex.text} (Razón: {ex.reason})</p>
              ))}
            </div>
        </details>
      }

      <Button onClick={simulateEvaluation} disabled={isSimulating} className="w-full flex items-center justify-center text-sm sm:text-base py-2 sm:py-2.5">
        {isSimulating && <LoadingSpinner size="sm" color="text-white"/>}
        <span className={isSimulating ? "ml-2" : ""}>Simular Evaluación con IA</span>
      </Button>

      {showSimulationResult && (
        <div className={`mt-3 sm:mt-4 p-3 rounded-md text-xs sm:text-sm ${simulationFeedback.toLowerCase().includes('apto') || (simulationFeedback.toLowerCase().includes('score') && !simulationFeedback.toLowerCase().includes('failed') && !simulationFeedback.toLowerCase().includes('issue')) ? 'bg-sky-700/50 text-sky-200' : 'bg-yellow-700/50 text-yellow-200'}`}>
          <p className="font-semibold mb-1 text-sm">Resultado y Justificación Simulados:</p>
          <p className="whitespace-pre-line">{simulationFeedback}</p>
           {evaluationResults[currentOffer.id] && (
            <div className="mt-2 pt-2 border-t border-slate-600 text-xs space-y-0.5">
                <p><strong>Estado:</strong> <span className={evaluationResults[currentOffer.id].administrativeCheck === 'APTO' ? 'text-green-300' : (evaluationResults[currentOffer.id].administrativeCheck === 'NO APTO' ? 'text-red-300' : 'text-slate-300')}>{evaluationResults[currentOffer.id].administrativeCheck || "Pendiente Admin"}</span></p>
                <p><strong>Punt. Técnica:</strong> {evaluationResults[currentOffer.id].technicalScore?.toFixed(0) ?? "N/D"} / 60</p>
                <p><strong>Punt. Económica:</strong> {evaluationResults[currentOffer.id].economicScore?.toFixed(0) ?? "N/D"} / 40</p>
                <p><strong>Punt. Final:</strong> {evaluationResults[currentOffer.id].finalScore?.toFixed(0) ?? "N/D"} / 100</p>
                {evaluationResults[currentOffer.id].issues && evaluationResults[currentOffer.id].issues!.length > 0 && 
                    <p><strong>Problemas Detectados:</strong> <span className="text-yellow-300">{evaluationResults[currentOffer.id].issues!.join(", ")}</span></p>
                }
            </div>
          )}
        </div>
      )}

      {showSimulationResult && (
        <Button onClick={handleNext} variant="secondary" className="w-full mt-2 text-sm sm:text-base py-2 sm:py-2.5">
          {currentOfferIndex < offers.length - 1 ? `Siguiente Oferta (${offers[currentOfferIndex+1]?.name || ''})` : (currentStepIndex < steps.length - 1 ? `Siguiente Paso: ${steps[currentStepIndex+1]?.name || ''}` : 'Completar Fase de Evaluación')}
        </Button>
      )}
    </div>
  );
};

export default PromptCraftingStage;