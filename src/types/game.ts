export interface Question {
  id: string;
  region: 'pulau_awan' | 'hutan_biru' | 'kota_tepi_laut';
  type: 'puzzle' | 'moral' | 'trivia' | 'event';
  category: string;
  difficulty: number;
  title: string;
  scenario?: string;
  question: string;
  questionImage?: string;
  options: QuestionOption[];
  hints: string[];
  timeLimit: number;
  requiredKarma?: number;
  tags: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  effect: {
    score: number;
    karma: number;
    item?: string;
    feedback: string;
  };
}

export interface Player {
  name: string;
  avatar: string;
  difficulty: 'casual' | 'adventure' | 'legendary';
}

export interface GameProgress {
  currentRegion: number;
  completedChallenges: string[];
  unlockedRegions: number[];
}

export interface GameStats {
  score: number;
  karma: number;
  startTime: number;
  playTime: number;
  hintsUsed: number;
}

export interface Inventory {
  fragments: {
    crown: boolean[];
    sash: boolean[];
  };
  hints: number;
  specialItems: string[];
}

export interface GameState {
  version: string;
  timestamp: string;
  player: Player;
  progress: GameProgress;
  stats: GameStats;
  inventory: Inventory;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    accessibility: Record<string, any>;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  karma: number;
  time: number;
  date: string;
  ending: 'good' | 'neutral' | 'bad';
}

export type EndingType = 'good' | 'neutral' | 'bad';

export interface Region {
  id: number;
  name: string;
  title: string;
  description: string;
  challenges: string[];
  unlocked: boolean;
}
