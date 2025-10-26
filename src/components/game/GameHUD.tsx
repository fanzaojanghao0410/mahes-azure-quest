import { GameState } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Lightbulb, Menu } from 'lucide-react';
import crownIcon from '@/assets/item_crown.png';
import sashIcon from '@/assets/item_sash.png';

interface GameHUDProps {
  gameState: GameState;
  onMenuClick?: () => void;
}

export const GameHUD = ({ gameState, onMenuClick }: GameHUDProps) => {
  const { player, stats, inventory, progress } = gameState;
  
  const crownCount = inventory.fragments.crown.filter(f => f).length;
  const sashCount = inventory.fragments.sash.filter(f => f).length;
  const totalProgress = ((progress.completedChallenges.length / 24) * 100);

  const getKarmaColor = (karma: number) => {
    if (karma >= 70) return 'text-success';
    if (karma >= 40) return 'text-gold';
    return 'text-destructive';
  };

  const getKarmaHearts = (karma: number) => {
    const hearts = Math.ceil(karma / 10);
    return hearts;
  };

  return (
    <div className="glass-morphism rounded-b-2xl shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Menu & Player Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {player.avatar === 'avatar1' && '👤'}
                {player.avatar === 'avatar2' && '🧑'}
                {player.avatar === 'avatar3' && '👧'}
                {player.avatar === 'avatar4' && '🧒'}
                {player.avatar === 'avatar5' && '👨'}
              </div>
              <div>
                <div className="font-bold text-foreground">{player.name}</div>
                <div className="text-xs text-muted-foreground">
                  Region {progress.currentRegion}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              <span className="font-bold text-lg">{stats.score}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${getKarmaColor(stats.karma)}`} />
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 rounded-sm ${
                      i < getKarmaHearts(stats.karma)
                        ? 'bg-success'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{stats.karma}</span>
            </div>

            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold" />
              <span className="font-bold">{inventory.hints}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Progress Keseluruhan
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(totalProgress)}%
            </span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {/* Inventory */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50">
            <img src={crownIcon} alt="Crown" className="w-6 h-6" />
            <span className="font-bold text-foreground">{crownCount}/6</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50">
            <img src={sashIcon} alt="Sash" className="w-6 h-6" />
            <span className="font-bold text-foreground">{sashCount}/6</span>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden flex justify-around mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold" />
            <span className="font-bold text-sm">{stats.score}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${getKarmaColor(stats.karma)}`} />
            <span className="font-bold text-sm">{stats.karma}</span>
          </div>

          <div className="flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-gold" />
            <span className="font-bold text-sm">{inventory.hints}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
