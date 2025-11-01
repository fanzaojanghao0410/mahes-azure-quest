import { Button } from '@/components/ui/button';
import { Sparkles, Play, Trophy, Settings, HelpCircle, Map, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import heroImage from '@/assets/hero.jpg';

interface LandingPageProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
}

export const LandingPage = ({ onStartGame, onShowLeaderboard }: LandingPageProps) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center relative overflow-hidden page-transition">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full floating-animation"
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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-8 fade-in">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground drop-shadow-lg">
            Mahes Adventure
          </h1>
          <div className="w-32 h-1 bg-primary mx-auto rounded-full shadow-glow" />
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
          Temukan Mahkota Mahes dan Selempang Biru Muda yang hilang di 3 region misterius
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button
            size="lg"
            onClick={onStartGame}
            className="text-lg px-10 py-6 rounded-full shadow-lg"
          >
            <Play className="mr-2 w-5 h-5" />
            Mulai Petualangan
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onShowLeaderboard}
            className="text-lg px-10 py-6 rounded-full"
          >
            <Trophy className="mr-2 w-5 h-5" />
            Leaderboard
          </Button>
        </div>

        {/* Secondary Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant="ghost"
            onClick={() => setShowHowToPlay(true)}
            className="gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Cara Bermain
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowSettings(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Pengaturan
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto">
          {[
            { icon: Map, title: '3 Region Mistis', desc: 'Pulau Awan, Hutan Biru, Kota Tepi Laut' },
            { icon: BookOpen, title: '24+ Tantangan', desc: 'Puzzle, kuis moral, dan event interaktif' },
            { icon: Trophy, title: 'Multiple Endings', desc: 'Keputusanmu menentukan nasib' }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="glass-morphism rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 scale-in cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                <h3 className="font-bold text-base mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Play Modal */}
      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Cara Bermain
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>🎯</span> Tujuan
              </h3>
              <p className="text-muted-foreground">
                Kumpulkan 6 Fragmen Mahkota dan 6 Fragmen Selempang dengan menjelajahi 3 region dan menyelesaikan tantangan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>🗺️</span> Alur Permainan
              </h3>
              <p className="text-muted-foreground">
                Landing → Setup Pemain → Region 1 (Pulau Awan) → Region 2 (Hutan Biru) → Region 3 (Kota Tepi Laut) → Ending
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>⚖️</span> Sistem Karma
              </h3>
              <p className="text-muted-foreground">
                Pilihan moralmu mempengaruhi karma (0-100). Karma 70+ = Good Ending, 40-69 = Neutral, 0-39 = Bad Ending.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span>🏆</span> Skor
              </h3>
              <p className="text-muted-foreground">
                Kumpulkan poin dengan menjawab tantangan. Semakin cepat dan akurat, semakin tinggi skormu!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Pengaturan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Volume Musik</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="70" 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">Volume Efek Suara</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="80" 
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm font-medium">Mode Gelap</span>
              <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
