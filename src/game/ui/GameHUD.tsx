import { Crown, Heart } from 'lucide-react';
import crownIcon from '@/assets/item_crown.png';
import sashIcon from '@/assets/item_sash.png';

interface GameHUDProps {
  stats: {
    xp: number;
    level: number;
    karma: number;
    crownFragments: number;
    sashFragments: number;
  };
}

export const GameHUD = ({ stats }: GameHUDProps) => {
  const xpForNextLevel = stats.level * 100;
  const xpProgress = (stats.xp % 100) / 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="glass-card mx-4 my-4 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Level & XP */}
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary/20 rounded-full px-3 py-1">
              <span className="text-accent-secondary font-bold">Lv {stats.level}</span>
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
                  style={{ width: `${xpProgress * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {stats.xp % 100} / 100 XP
              </p>
            </div>
          </div>

          {/* Karma */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-warning" fill="currentColor" />
            <span className="text-text-primary font-semibold">{stats.karma}</span>
          </div>

          {/* Fragments */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={crownIcon} alt="Crown" className="w-6 h-6" />
              <span className="text-text-primary font-semibold">
                {stats.crownFragments}/6
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img src={sashIcon} alt="Sash" className="w-6 h-6" />
              <span className="text-text-primary font-semibold">
                {stats.sashFragments}/6
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
