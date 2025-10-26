import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Player } from '@/types/game';
import { Sparkles } from 'lucide-react';

interface PlayerSetupProps {
  onComplete: (player: Player) => void;
}

export const PlayerSetup = ({ onComplete }: PlayerSetupProps) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('avatar1');
  const [difficulty, setDifficulty] = useState<Player['difficulty']>('adventure');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError('Nama harus minimal 3 karakter');
      return;
    }
    if (trimmedName.length > 15) {
      setError('Nama maksimal 15 karakter');
      return;
    }
    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmedName)) {
      setError('Nama hanya boleh mengandung huruf, angka, dan underscore');
      return;
    }

    onComplete({
      name: trimmedName,
      avatar,
      difficulty
    });
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="glass-morphism rounded-3xl p-8 md:p-12 max-w-2xl w-full scale-in shadow-lg">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Siapa Namamu, Petualang?
          </h2>
          <p className="text-muted-foreground">
            Persiapkan dirimu untuk petualangan yang tak terlupakan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="player-name" className="text-lg font-semibold mb-2 block">
              Nama Petualang
            </Label>
            <Input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Masukkan namamu..."
              className="text-lg py-6 rounded-xl border-2 focus:border-primary"
              maxLength={15}
            />
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              3-15 karakter, huruf, angka, dan underscore
            </p>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">
              Pilih Avatar
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5'].map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`aspect-square rounded-xl border-2 transition-all duration-300 ${
                    avatar === av
                      ? 'border-primary bg-primary/20 scale-105 shadow-glow'
                      : 'border-border hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {av === 'avatar1' && '👤'}
                    {av === 'avatar2' && '🧑'}
                    {av === 'avatar3' && '👧'}
                    {av === 'avatar4' && '🧒'}
                    {av === 'avatar5' && '👨'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">
              Tingkat Kesulitan
            </Label>
            <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as Player['difficulty'])}>
              <div className="space-y-3">
                {[
                  { value: 'casual', label: 'Santai', desc: 'Lebih banyak petunjuk, waktu lebih lama' },
                  { value: 'adventure', label: 'Petualang', desc: 'Pengalaman seimbang (Rekomendasi)' },
                  { value: 'legendary', label: 'Legendaris', desc: 'Tantangan maksimal, tanpa petunjuk' }
                ].map((diff) => (
                  <div
                    key={diff.value}
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      difficulty === diff.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={diff.value} id={diff.value} className="mt-1" />
                    <Label htmlFor={diff.value} className="cursor-pointer flex-1">
                      <div className="font-semibold text-base">{diff.label}</div>
                      <div className="text-sm text-muted-foreground">{diff.desc}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-lg py-6 rounded-xl shadow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground"
          >
            Mulai Perjalanan
          </Button>
        </form>
      </div>
    </div>
  );
};
