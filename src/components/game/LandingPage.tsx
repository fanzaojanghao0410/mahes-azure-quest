import { Button } from '@/components/ui/button';
import { Sparkles, Play, Trophy, Settings } from 'lucide-react';
import heroImage from '@/assets/hero.jpg';

interface LandingPageProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
}

export const LandingPage = ({ onStartGame, onShowLeaderboard }: LandingPageProps) => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full floating-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto fade-in">
        {/* Logo/Title */}
        <div className="mb-8">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-foreground drop-shadow-lg">
            Mahes Adventure
          </h1>
          <div className="w-32 h-1 bg-primary mx-auto rounded-full shadow-glow" />
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto font-medium">
          Temukan Mahkota Mahes dan Selempang Biru Muda yang hilang di 3 region misterius
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            onClick={onStartGame}
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="mr-2 w-6 h-6" />
            Mulai Petualangan
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onShowLeaderboard}
            className="text-lg px-8 py-6 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
          >
            <Trophy className="mr-2 w-5 h-5" />
            Leaderboard
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { icon: '🏝️', title: '3 Region', desc: 'Pulau Awan, Hutan Biru, Kota Tepi Laut' },
            { icon: '🧩', title: '24+ Tantangan', desc: 'Puzzle, kuis moral, dan event interaktif' },
            { icon: '⚖️', title: 'Sistem Karma', desc: 'Pilihan mempengaruhi ending cerita' }
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-morphism rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Button */}
      <button
        className="absolute top-4 right-4 p-3 rounded-full glass-morphism hover:bg-primary/20 transition-all duration-300"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6 text-foreground" />
      </button>
    </div>
  );
};
