import React from 'react';
import Button from './Button';

interface StageIntroProps {
  title: string;
  description: string;
  onNext: () => void;
}

const StageIntro: React.FC<StageIntroProps> = ({ title, description, onNext }) => {
  return (
    <div className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-6 p-4 rounded-lg bg-slate-700/30 shadow-lg">
      <h2 className="text-3xl font-bold text-sky-400">{title}</h2>
      <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-line">{description}</p>
      <Button onClick={onNext} size="lg">
        Continuar
      </Button>
    </div>
  );
};

export default StageIntro;