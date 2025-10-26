import { Button } from '@/components/ui/button';
import { EndingType } from '@/types/game';
import { Trophy, RotateCcw, Share2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';
import crownIcon from '@/assets/item_crown.png';
import sashIcon from '@/assets/item_sash.png';

interface EndingScreenProps {
  endingType: EndingType;
  stats: {
    score: number;
    karma: number;
    time: number;
    hintsUsed: number;
  };
  onPlayAgain: () => void;
  onSaveToLeaderboard: () => void;
}

const endings = {
  good: {
    title: '🏆 Pahlawan Sejati!',
    description: 'Kamu berhasil mengumpulkan kedua artefak dengan hati yang mulia. Mahkota Mahes dan Selempang Biru Muda bersinar terang di tanganmu. Legenda petualanganmu akan dikenang selamanya!',
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  neutral: {
    title: '⚖️ Petualang Tangguh',
    description: 'Misi selesai! Kamu mendapatkan kedua artefak, meskipun perjalananmu penuh dengan pilihan yang rumit. Pengalaman ini mengajarkanmu banyak hal tentang dirimu sendiri.',
    color: 'text-gold',
    bgColor: 'bg-gold/10'
  },
  bad: {
    title: '💔 Perjalanan Belum Selesai',
    description: 'Sayangnya, artefak masih belum lengkap atau karma yang terkumpul belum cukup. Jangan menyerah! Setiap petualang hebat pernah mengalami kegagalan sebelum mencapai kejayaan.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10'
  }
};

export const EndingScreen = ({
  endingType,
  stats,
  onPlayAgain,
  onSaveToLeaderboard
}: EndingScreenProps) => {
  const { width, height } = useWindowSize();
  const ending = endings[endingType];
  const showConfetti = endingType === 'good';

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}j ${minutes}m ${secs}d`;
    }
    return `${minutes}m ${secs}d`;
  };

  const handleShare = () => {
    const text = `Saya menyelesaikan Mahes Adventure dengan ending ${endingType === 'good' ? 'Pahlawan Sejati' : endingType === 'neutral' ? 'Petualang Tangguh' : 'belum sempurna'}! Score: ${stats.score}, Karma: ${stats.karma}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mahes Adventure',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Hasil dicopy ke clipboard!');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          colors={['#67c7ff', '#ffd166', '#4ecdc4', '#ffffff']}
        />
      )}

      <div className="glass-morphism rounded-3xl p-8 md:p-12 max-w-4xl w-full scale-in shadow-glow">
        {/* Artifacts Display */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="relative floating-animation">
            <img src={crownIcon} alt="Crown" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" />
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl -z-10" />
          </div>
          <div className="relative floating-animation" style={{ animationDelay: '0.5s' }}>
            <img src={sashIcon} alt="Sash" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" />
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl -z-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-4xl md:text-6xl font-bold text-center mb-4 ${ending.color}`}>
          {ending.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-center text-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto">
          {ending.description}
        </p>

        {/* Stats Grid */}
        <div className={`${ending.bgColor} rounded-2xl p-6 mb-8`}>
          <h3 className="text-xl font-bold text-center mb-6 text-foreground">
            📊 Statistik Petualangan
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-xl">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gold">{stats.score}</div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>

            <div className="text-center p-4 bg-card rounded-xl">
              <div className="text-3xl mb-2">❤️</div>
              <div className={`text-2xl font-bold ${
                stats.karma >= 70 ? 'text-success' : stats.karma >= 40 ? 'text-gold' : 'text-destructive'
              }`}>
                {stats.karma}/100
              </div>
              <div className="text-sm text-muted-foreground">Karma</div>
            </div>

            <div className="text-center p-4 bg-card rounded-xl">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-primary">{formatTime(stats.time)}</div>
              <div className="text-sm text-muted-foreground">Waktu</div>
            </div>

            <div className="text-center p-4 bg-card rounded-xl">
              <div className="text-3xl mb-2">💡</div>
              <div className="text-2xl font-bold text-foreground">{stats.hintsUsed}</div>
              <div className="text-sm text-muted-foreground">Hint Digunakan</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => {
              onSaveToLeaderboard();
              onPlayAgain();
            }}
            size="lg"
            className="flex-1 text-lg py-6 rounded-xl shadow-lg hover:shadow-glow bg-primary text-primary-foreground"
          >
            <RotateCcw className="mr-2 w-5 h-5" />
            Main Lagi
          </Button>

          <Button
            onClick={onSaveToLeaderboard}
            size="lg"
            variant="outline"
            className="sm:w-auto text-lg py-6 rounded-xl border-2 border-gold/50 hover:border-gold hover:bg-gold/10"
          >
            <Trophy className="mr-2 w-5 h-5" />
            Simpan ke Leaderboard
          </Button>

          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="sm:w-auto text-lg py-6 rounded-xl border-2 border-primary/50 hover:border-primary hover:bg-primary/10"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Bagikan
          </Button>
        </div>
      </div>
    </div>
  );
};
