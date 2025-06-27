
export enum GameStage {
  INTRODUCTION = 'INTRODUCTION',
  BASIC_PROMPT_INTRO = 'BASIC_PROMPT_INTRO',
  BASIC_PROMPT_SIM = 'BASIC_PROMPT_SIM',
  TASK_MAPPING_INTRO = 'TASK_MAPPING_INTRO',
  TASK_MAPPING = 'TASK_MAPPING',
  CONSTITUTIONAL_AI_INTRO = 'CONSTITUTIONAL_AI_INTRO',
  CONSTITUTIONAL_AI = 'CONSTITUTIONAL_AI',
  PROMPT_CHAINING_INTRO = 'PROMPT_CHAINING_INTRO',
  PROMPT_CHAINING = 'PROMPT_CHAINING', // This will be the main interactive part
  FEW_SHOT_LEARNING_INTRO = 'FEW_SHOT_LEARNING_INTRO', // Integrated into Prompt_Chaining
  FINAL_SUMMARY_INTRO = 'FINAL_SUMMARY_INTRO',
  GAME_SUMMARY = 'GAME_SUMMARY',
}

export interface StageContent {
  title: string;
  description: string;
}

export interface Offer {
  id: number;
  name: string;
  description: string;
  adminDocsComplete: boolean;
  technicalProposalStrength: 'weak' | 'average' | 'strong'; // Simplified for game
  price: number;
  // For Constitutional AI checks
  clarity: boolean; // Transparency
  usesQuantifiableData: boolean; // Objectivity
  justificationProvided: boolean; // Justification
}

export interface EvaluationResult {
  id: number;
  name: string;
  administrativeCheck: 'APTO' | 'NO APTO' | '';
  technicalScore: number; // 0-60
  economicScore: number; // 0-40
  finalScore: number; // 0-100
  issues: string[]; // For constitutional AI violations or bad prompt results
  technicalRationale?: string;
  economicRationale?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface ConstitutionalPrinciple {
  id: string;
  name: string;
  description: string;
  exampleViolation: string;
  exampleAdherence: string;
}

export interface PromptEnhancementChoice {
  id: string;
  text: string;
  isGood: boolean;
  feedback?: string; // Feedback if chosen
}

export interface PromptChainingStep {
  id: string;
  name: string; // e.g., "Administrative Verification", "Technical Evaluation"
  basePrompt: string;
  criteria?: string; // e.g., "Methodology (25pts), Team (20pts), Experience (15pts)"
  outputFormatExample: string;
  fewShotExamplesGood: { id: string, text: string; points?: number }[];
  fewShotExamplesBad: { id: string, text: string; reason: string }[];
  enhancementChoices: PromptEnhancementChoice[];
}

export interface PlayerChoice {
    type: 'TASK_ORDER' | 'PRINCIPLE_CHECK' | 'PROMPT_ENHANCEMENT';
    value: any; // Could be an array of task IDs, selected principle, chosen enhancements
    isCorrect?: boolean; // Optional: for immediate feedback
}
