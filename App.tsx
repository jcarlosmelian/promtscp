import React, { useState, useCallback, useEffect } from 'react';
import { GameStage, Offer, EvaluationResult, PlayerChoice } from './types';
import { STAGES_CONTENT, INITIAL_OFFERS, GAME_TITLE_SVG, CONSTITUTIONAL_PRINCIPLES, PROMPT_CHAINING_STEPS } from './constants';
import StageIntro from './components/StageIntro';
import BasicPromptStage from './components/BasicPromptStage';
import TaskMappingStage from './components/TaskMappingStage';
import ConstitutionalAIStage from './components/ConstitutionalAIStage';
import PromptCraftingStage from './components/PromptCraftingStage';
import GameSummaryStage from './components/GameSummaryStage';
import { GoogleGenAI } from '@google/genai';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<GameStage>(GameStage.INTRODUCTION);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [evaluationResults, setEvaluationResults] = useState<{[offerId: number]: EvaluationResult}>({});
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [expertQuery, setExpertQuery] = useState<string>('');

  const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

  const handleNextStage = useCallback(() => {
    setCurrentStage(prevStage => {
      const stageOrder = Object.values(GameStage);
      const currentIndex = stageOrder.indexOf(prevStage);
      if (currentIndex < stageOrder.length - 1) {
        return stageOrder[currentIndex + 1];
      }
      return prevStage; // Stay on last stage if no next
    });
  }, []);

  const updateEvaluationResult = useCallback((offerId: number, partialResult: Partial<EvaluationResult>) => {
    setEvaluationResults(prev => ({
      ...prev,
      [offerId]: {
        ...(prev[offerId] || { id: offerId, name: offers.find(o => o.id === offerId)?.name || '', administrativeCheck: '', technicalScore: 0, economicScore: 0, finalScore: 0, issues: [] }),
        ...partialResult,
      }
    }));
  }, [offers]);
  
  const handlePlayerChoice = useCallback((stage: GameStage, choice: PlayerChoice) => {
    // Handle choices for specific stages, e.g., TaskMapping order
    // For now, this is a placeholder
    console.log(`Player choice for stage ${stage}:`, choice);
    if (stage === GameStage.TASK_MAPPING && choice.isCorrect) {
       // Add positive feedback or unlock next step within stage
    }
  }, []);

  const handleAskExpert = async () => {
    if (!ai || !expertQuery.trim()) {
      setGeminiResponse("La clave de API no está configurada o la consulta está vacía.");
      return;
    }
    setGeminiLoading(true);
    setGeminiResponse('');
    try {
      const model = "gemini-2.5-flash-preview-04-17";
      const prompt = `Eres un experto en contratación del sector público (LCSP española) y en ingeniería de prompts. Responde de forma concisa: ${expertQuery}`;
      const result = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      setGeminiResponse(result.text);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setGeminiResponse("Lo siento, no pude obtener una respuesta. Por favor, revisa tu clave de API y tu conexión.");
    } finally {
      setGeminiLoading(false);
    }
  };

  const renderCurrentStage = () => {
    const stageContent = STAGES_CONTENT[currentStage];
    switch (currentStage) {
      case GameStage.INTRODUCTION:
      case GameStage.BASIC_PROMPT_INTRO:
      case GameStage.TASK_MAPPING_INTRO:
      case GameStage.CONSTITUTIONAL_AI_INTRO:
      case GameStage.PROMPT_CHAINING_INTRO:
      case GameStage.FEW_SHOT_LEARNING_INTRO:
      case GameStage.FINAL_SUMMARY_INTRO:
        return <StageIntro title={stageContent.title} description={stageContent.description} onNext={handleNextStage} />;
      case GameStage.BASIC_PROMPT_SIM:
        return <BasicPromptStage onComplete={handleNextStage} />;
      case GameStage.TASK_MAPPING:
        return <TaskMappingStage onComplete={handleNextStage} onPlayerChoice={choice => handlePlayerChoice(currentStage, choice)} />;
      case GameStage.CONSTITUTIONAL_AI:
        return <ConstitutionalAIStage principles={CONSTITUTIONAL_PRINCIPLES} onComplete={handleNextStage} />;
      case GameStage.PROMPT_CHAINING:
        return <PromptCraftingStage
                  offers={offers}
                  steps={PROMPT_CHAINING_STEPS}
                  evaluationResults={evaluationResults}
                  updateEvaluationResult={updateEvaluationResult}
                  onCompleteStage={handleNextStage} />;
      case GameStage.GAME_SUMMARY:
        return <GameSummaryStage results={evaluationResults} offers={offers} />;
      default:
        return <StageIntro title="¡Bienvenido!" description="Vamos a aprender sobre Ingeniería de Prompts." onNext={handleNextStage} />;
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-2 sm:p-4 bg-slate-900">
      <div className="aspect-[16/9] w-full max-w-[1440px] h-auto max-h-full bg-slate-800 text-slate-100 shadow-2xl rounded-lg overflow-hidden flex flex-col">
        <header className="p-3 sm:p-4 bg-slate-700/50 flex items-center justify-between border-b border-slate-600">
          <div className="flex items-center space-x-2">
            {GAME_TITLE_SVG}
            <h1 className="text-sm sm:text-xl font-bold text-sky-400">Ingeniería de Prompts: Evaluador LCSP</h1>
          </div>
          <div className="text-xs sm:text-sm text-slate-400 hidden md:block">Fase: {STAGES_CONTENT[currentStage]?.title || currentStage.replace(/_/g, ' ')}</div>
        </header>
        
        <main className="flex-grow p-3 sm:p-6 overflow-y-auto">
          {renderCurrentStage()}
        </main>

        <footer className="p-3 sm:p-4 bg-slate-700/50 border-t border-slate-600 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                value={expertQuery}
                onChange={(e) => setExpertQuery(e.target.value)}
                placeholder="Haz una pregunta experta a Gemini..."
                className="bg-slate-600 text-slate-100 placeholder-slate-400 p-2 rounded-md text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none w-48 sm:w-72"
                disabled={!ai || geminiLoading}
              />
              <button 
                onClick={handleAskExpert}
                disabled={!ai || geminiLoading || !expertQuery.trim()}
                className="px-3 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-xs sm:text-sm disabled:opacity-50 flex items-center"
              >
                {geminiLoading && <LoadingSpinner size="sm" />} Preguntar
              </button>
            </div>
            {geminiResponse && (
              <div className="mt-2 sm:mt-0 p-2 bg-slate-600 rounded-md text-slate-200 max-w-md text-xs overflow-y-auto max-h-20">
                <strong>Experto:</strong> {geminiResponse}
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;