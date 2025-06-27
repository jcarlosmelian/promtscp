import React, { useState, useEffect } from 'react';
import Button from './Button';
import { TASKS_FOR_MAPPING } from '../constants';
import { Task, PlayerChoice } from '../types';

interface TaskMappingStageProps {
  onComplete: () => void;
  onPlayerChoice: (choice: PlayerChoice) => void;
}

const TaskMappingStage: React.FC<TaskMappingStageProps> = ({ onComplete, onPlayerChoice }) => {
  const [sequencedTasks, setSequencedTasks] = useState<Task[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isCorrectOrder, setIsCorrectOrder] = useState<boolean | null>(null);

  useEffect(() => {
    // Shuffle tasks for selection challenge, or just present them
    setAvailableTasks([...TASKS_FOR_MAPPING].sort(() => Math.random() - 0.5)); 
  }, []);

  const handleSelectTask = (task: Task) => {
    setSequencedTasks([...sequencedTasks, task]);
    setAvailableTasks(availableTasks.filter(t => t.id !== task.id));
    setIsCorrectOrder(null); // Reset correctness check on new selection
  };

  const handleReset = () => {
    setSequencedTasks([]);
    setAvailableTasks([...TASKS_FOR_MAPPING].sort(() => Math.random() - 0.5));
    setIsCorrectOrder(null);
  };

  const checkOrder = () => {
    if (sequencedTasks.length !== TASKS_FOR_MAPPING.length) {
      setIsCorrectOrder(false);
      onPlayerChoice({ type: 'TASK_ORDER', value: sequencedTasks.map(t => t.id), isCorrect: false });
      return;
    }
    const correct = sequencedTasks.every((task, index) => task.order === index + 1);
    setIsCorrectOrder(correct);
    onPlayerChoice({ type: 'TASK_ORDER', value: sequencedTasks.map(t => t.id), isCorrect: correct });
  };
  
  const sortedCorrectTasks = [...TASKS_FOR_MAPPING].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-slate-700/50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-sky-400 mb-1">Mapea las Tareas de Evaluación</h2>
      <p className="text-slate-300 mb-4">Selecciona las tareas en el orden correcto para construir el flujo de trabajo de evaluación. El orden correcto es crucial para un proceso lógico.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Tasks */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-100">Tareas Disponibles:</h3>
          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <button
                key={task.id}
                onClick={() => handleSelectTask(task)}
                className="w-full text-left p-3 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
              >
                <span className="font-medium">{task.name}</span>
                <p className="text-xs text-slate-300">{task.description}</p>
              </button>
            ))
          ) : (
            <p className="text-slate-400 italic">Todas las tareas seleccionadas. Comprueba tu secuencia.</p>
          )}
        </div>

        {/* Sequenced Tasks */}
        <div className="space-y-3 p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-100">Tu Secuencia:</h3>
          {sequencedTasks.length > 0 ? (
            sequencedTasks.map((task, index) => (
              <div key={task.id} className="p-3 bg-sky-700/70 rounded-md">
                <span className="font-medium">{index + 1}. {task.name}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">Selecciona tareas de la izquierda para construir tu secuencia.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
        <Button onClick={checkOrder} disabled={sequencedTasks.length === 0}>Comprobar Mi Secuencia</Button>
        <Button onClick={handleReset} variant="secondary">Reiniciar Secuencia</Button>
        {isCorrectOrder === true && (
          <Button onClick={onComplete} className="bg-green-600 hover:bg-green-500">¡Correcto! Continuar</Button>
        )}
      </div>

      {isCorrectOrder !== null && (
        <div className={`mt-4 p-3 rounded-md text-sm ${isCorrectOrder ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
          {isCorrectOrder ? "¡Orden correcto! Este enfoque estructurado es vital." : "Orden incorrecto, o no todas las tareas están secuenciadas. Inténtalo de nuevo. La secuencia correcta se muestra a continuación para tu aprendizaje."}
           {!isCorrectOrder && (
             <div className="mt-2 pt-2 border-t border-slate-600">
                <p className="font-semibold text-slate-200">Orden Correcto:</p>
                <ol className="list-decimal list-inside text-slate-300">
                    {sortedCorrectTasks.map(task => <li key={task.id}>{task.name}</li>)}
                </ol>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default TaskMappingStage;