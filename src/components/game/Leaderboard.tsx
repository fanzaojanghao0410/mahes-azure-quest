import { Button } from '@/components/ui/button';
import { LeaderboardEntry } from '@/types/game';
import { Trophy, Medal, Award, X } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

export const Leaderboard = ({ entries, onClose }: LeaderboardProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-gold" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-6 h-6 text-destructive/70" />;
    return null;
  };

  const getEndingBadge = (ending: string) => {
    const badges = {
      good: { emoji: '🏆', label: 'Pahlawan', color: 'bg-success/20 text-success' },
      neutral: { emoji: '⚖️', label: 'Tangguh', color: 'bg-gold/20 text-gold-foreground' },
      bad: { emoji: '💔', label: 'Belum Selesai', color: 'bg-muted text-muted-foreground' }
    };
    return badges[ending as keyof typeof badges] || badges.neutral;
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-morphism rounded-3xl p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col scale-in shadow-glow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Belum ada entri leaderboard</p>
              <p className="text-sm">Jadilah yang pertama menyelesaikan petualangan!</p>
            </div>
          ) : (
            entries.map((entry, index) => {
              const rank = index + 1;
              const badge = getEndingBadge(entry.ending);
              
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    rank <= 3
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border bg-card/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 flex-shrink-0 text-center">
                      {getRankIcon(rank) || (
                        <span className="text-2xl font-bold text-muted-foreground">
                          #{rank}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-foreground truncate">
                          {entry.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>
                          {badge.emoji} {badge.label}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-gold">⭐</span>
                          {entry.score.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-success">❤️</span>
                          {entry.karma}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-primary">⏱️</span>
                          {formatTime(entry.time)}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:block text-right text-sm text-muted-foreground flex-shrink-0">
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-6 border-t border-border">
          <Button
            onClick={onClose}
            size="lg"
            className="w-full text-lg py-6 rounded-xl bg-primary text-primary-foreground"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};
