import { GameState, Question, EndingType, LeaderboardEntry } from '@/types/game';
import questionsData from '@/data/questions.json';

const STORAGE_KEY = 'mahesAdventure_saveSlot1';
const LEADERBOARD_KEY = 'mahesAdventure_leaderboard';

export class GameManager {
  private static instance: GameManager;
  
  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  getInitialState(): GameState {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      player: {
        name: '',
        avatar: 'avatar1',
        difficulty: 'adventure'
      },
      progress: {
        currentRegion: 1,
        completedChallenges: [],
        unlockedRegions: [1]
      },
      stats: {
        score: 0,
        karma: 50,
        startTime: Date.now(),
        playTime: 0,
        hintsUsed: 0
      },
      inventory: {
        fragments: {
          crown: [false, false, false, false, false, false],
          sash: [false, false, false, false, false, false]
        },
        hints: 3,
        specialItems: []
      },
      settings: {
        musicVolume: 0.7,
        sfxVolume: 0.8,
        accessibility: {}
      }
    };
  }

  saveGame(state: GameState): boolean {
    try {
      state.timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  loadGame(): GameState | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    return null;
  }

  getQuestions(): Question[] {
    const questions = questionsData.questions as Question[];
    // Randomize question order for each game
    return [...questions].sort(() => Math.random() - 0.5);
  }

  getQuestionsByRegion(region: string): Question[] {
    return this.getQuestions().filter(q => q.region === region);
  }

  getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find(q => q.id === id);
  }

  calculateEnding(karma: number, hasAllFragments: boolean): EndingType {
    if (!hasAllFragments) {
      return 'bad';
    }
    
    if (karma >= 70) {
      return 'good';
    } else if (karma >= 40) {
      return 'neutral';
    } else {
      return 'bad';
    }
  }

  hasAllFragments(state: GameState): boolean {
    const allCrown = state.inventory.fragments.crown.every(f => f);
    const allSash = state.inventory.fragments.sash.every(f => f);
    return allCrown && allSash;
  }

  getFragmentCount(state: GameState): { crown: number; sash: number; total: number } {
    const crown = state.inventory.fragments.crown.filter(f => f).length;
    const sash = state.inventory.fragments.sash.filter(f => f).length;
    return { crown, sash, total: crown + sash };
  }

  addFragment(state: GameState, fragmentId: string): GameState {
    const newState = { ...state };
    
    if (fragmentId.startsWith('fragment_crown_')) {
      const index = parseInt(fragmentId.split('_')[2]) - 1;
      if (index >= 0 && index < 6) {
        newState.inventory.fragments.crown[index] = true;
      }
    } else if (fragmentId.startsWith('fragment_sash_')) {
      const index = parseInt(fragmentId.split('_')[2]) - 1;
      if (index >= 0 && index < 6) {
        newState.inventory.fragments.sash[index] = true;
      }
    }
    
    return newState;
  }

  updateKarma(state: GameState, change: number): GameState {
    const newKarma = Math.max(0, Math.min(100, state.stats.karma + change));
    return {
      ...state,
      stats: {
        ...state.stats,
        karma: newKarma
      }
    };
  }

  updateScore(state: GameState, change: number): GameState {
    const newScore = Math.max(0, state.stats.score + change);
    return {
      ...state,
      stats: {
        ...state.stats,
        score: newScore
      }
    };
  }

  useHint(state: GameState): GameState {
    if (state.inventory.hints > 0) {
      return {
        ...state,
        inventory: {
          ...state.inventory,
          hints: state.inventory.hints - 1
        },
        stats: {
          ...state.stats,
          hintsUsed: state.stats.hintsUsed + 1
        }
      };
    }
    return state;
  }

  saveToLeaderboard(entry: Omit<LeaderboardEntry, 'id'>): void {
    try {
      const leaderboard = this.getLeaderboard();
      const newEntry: LeaderboardEntry = {
        ...entry,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      leaderboard.push(newEntry);
      leaderboard.sort((a, b) => b.score - a.score);
      
      // Keep top 50
      const trimmed = leaderboard.slice(0, 50);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save to leaderboard:', error);
    }
  }

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    return [];
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const gameManager = GameManager.getInstance();
