import React from 'react';
import { EvaluationResult, Offer } from '../types';
import { GameStage } from '../types'; // Corrected import for GameStage

interface GameSummaryStageProps {
  results: { [offerId: number]: EvaluationResult };
  offers: Offer[];
}

// Data from paper's page 10 table for comparison (simplified)
const methodologyComparison = [
  { name: "Prompt Básico", complexity: "Baja", time: "Rápido", precision: "Baja", bestFor: "Consultas simples" },
  { name: "Mapeo de Tareas", complexity: "Alta", time: "Medio", precision: "Alta", bestFor: "Procesos complejos" },
  { name: "IA Constitucional", complexity: "Media", time: "Medio", precision: "Alta", bestFor: "Cumplimiento (LCSP)" },
  { name: "Encadenamiento de Prompts", complexity: "Alta", time: "Lento", precision: "Muy Alta", bestFor: "Flujos de trabajo complejos" },
  { name: "Aprendizaje Few-shot", complexity: "Media", time: "Rápido", precision: "Alta", bestFor: "Patrones conocidos" },
  { name: "Nuestro Enfoque Combinado (Juego)", complexity: "Alta", time: "Medio-Lento", precision: "Muy Alta", bestFor: "Evaluación LCSP robusta" }
];


const GameSummaryStage: React.FC<GameSummaryStageProps> = ({ results, offers }) => {
  const sortedResults = Object.values(results).sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-slate-700/50 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-sky-400 text-center">¡Evaluación Completa!</h2>
      
      <div className="bg-slate-600 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-100 mb-3">Clasificación Final de Ofertas:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="text-xs text-sky-300 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-2">Pos.</th>
                <th scope="col" className="px-4 py-2">Nombre Oferta</th>
                <th scope="col" className="px-4 py-2">Verif. Admin</th>
                <th scope="col" className="px-4 py-2">Punt. Téc. (/60)</th>
                <th scope="col" className="px-4 py-2">Punt. Econ. (/40)</th>
                <th scope="col" className="px-4 py-2">Punt. Final (/100)</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((res, index) => (
                <tr key={res.id} className={`border-b border-slate-700 ${index === 0 && res.administrativeCheck === 'APTO' ? 'bg-green-700/30' : (res.administrativeCheck === 'NO APTO' ? 'bg-red-700/40' : 'bg-slate-800/50 hover:bg-slate-700/70')}`}>
                  <td className="px-4 py-2 font-medium">{res.administrativeCheck === 'APTO' ? index + 1 : 'N/D'}</td>
                  <td className="px-4 py-2 font-semibold">{offers.find(o => o.id === res.id)?.name || 'Desconocido'}</td>
                  <td className={`px-4 py-2 font-bold ${res.administrativeCheck === 'APTO' ? 'text-green-400' : 'text-red-400'}`}>{res.administrativeCheck || 'N/D'}</td>
                  <td className="px-4 py-2">{res.technicalScore ?? 'N/D'}</td>
                  <td className="px-4 py-2">{res.economicScore ?? 'N/D'}</td>
                  <td className="px-4 py-2 text-lg font-bold">{res.administrativeCheck === 'APTO' ? (res.finalScore ?? 'N/D') : <span className="text-red-400">NO APTO</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-600 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-100 mb-3">Aprendizajes Clave y Comparativa de Metodologías:</h3>
        <p className="text-slate-300 mb-4">
          A lo largo de este juego, has aplicado una combinación de potentes técnicas de ingeniería de prompts: 
          Mapeo de Tareas, IA Constitucional, Encadenamiento de Prompts y Aprendizaje Few-Shot. Este enfoque estructurado, 
          como se recomienda para evaluaciones complejas de la LCSP, conduce a resultados más transparentes, objetivos y 
          defendibles en comparación con prompts básicos y no estructurados.
        </p>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-200">
                <thead className="text-xs text-sky-300 uppercase bg-slate-700">
                    <tr>
                        <th className="px-3 py-2">Metodología</th>
                        <th className="px-3 py-2">Complejidad</th>
                        <th className="px-3 py-2">Tiempo</th>
                        <th className="px-3 py-2">Precisión</th>
                        <th className="px-3 py-2">Ideal para</th>
                    </tr>
                </thead>
                <tbody>
                    {methodologyComparison.map(m => (
                        <tr key={m.name} className={`border-b border-slate-700 ${m.name === "Nuestro Enfoque Combinado (Juego)" ? "bg-sky-700/40 font-semibold" : "bg-slate-800/50 hover:bg-slate-700/70"}`}>
                            <td className="px-3 py-2">{m.name}</td>
                            <td className="px-3 py-2">{m.complexity}</td>
                            <td className="px-3 py-2">{m.time}</td>
                            <td className="px-3 py-2">{m.precision}</td>
                            <td className="px-3 py-2">{m.bestFor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      <p className="text-center text-slate-300 mt-6">¡Enhorabuena por completar el Juego de Evaluación de Ingeniería de Prompts para la LCSP!</p>
    </div>
  );
};

export default GameSummaryStage;