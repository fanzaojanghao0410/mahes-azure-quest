import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, MapPin } from 'lucide-react';
import { GameProgress } from '@/types/game';
import region1Bg from '@/assets/region1_bg.jpg';
import region2Bg from '@/assets/region2_bg.jpg';
import region3Bg from '@/assets/region3_bg.jpg';

interface RegionMapProps {
  progress: GameProgress;
  onSelectRegion: (regionId: number) => void;
}

const regions = [
  {
    id: 1,
    name: 'pulau_awan',
    title: 'Pulau Awan',
    description: 'Pulau mengambang di langit dengan arsitektur kuno',
    image: region1Bg,
    challenges: 5
  },
  {
    id: 2,
    name: 'hutan_biru',
    title: 'Hutan Biru',
    description: 'Hutan mistis dengan flora bercahaya biru',
    image: region2Bg,
    challenges: 5
  },
  {
    id: 3,
    name: 'kota_tepi_laut',
    title: 'Kota Tepi Laut',
    description: 'Pelabuhan kuno dengan mercusuar legendaris',
    image: region3Bg,
    challenges: 5
  }
];

export const RegionMap = ({ progress, onSelectRegion }: RegionMapProps) => {
  const isRegionUnlocked = (regionId: number) => {
    return progress.unlockedRegions.includes(regionId);
  };

  const isRegionCompleted = (regionId: number) => {
    const regionQuestions = regions[regionId - 1].challenges;
    const completed = progress.completedChallenges.filter(
      id => id.includes(`q00${regionId}`) || id.includes(`q0${regionId}`)
    ).length;
    return completed >= regionQuestions;
  };

  const isCurrentRegion = (regionId: number) => {
    return progress.currentRegion === regionId;
  };

  return (
    <div className="min-h-screen gradient-hero py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Peta Dunia Mahes
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih region untuk memulai petualanganmu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regions.map((region, index) => {
            const unlocked = isRegionUnlocked(region.id);
            const completed = isRegionCompleted(region.id);
            const current = isCurrentRegion(region.id);

            return (
              <div
                key={region.id}
                className={`group relative scale-in ${
                  !unlocked ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div
                  className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${
                    unlocked
                      ? 'transform hover:scale-105 hover:shadow-glow cursor-pointer'
                      : 'cursor-not-allowed grayscale'
                  } ${current ? 'ring-4 ring-primary shadow-glow' : ''}`}
                  onClick={() => unlocked && onSelectRegion(region.id)}
                >
                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={region.image}
                      alt={region.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {completed && (
                        <div className="bg-success text-success-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          Selesai
                        </div>
                      )}
                      {!unlocked && (
                        <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
                          <Lock className="w-4 h-4" />
                          Terkunci
                        </div>
                      )}
                      {current && unlocked && !completed && (
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg animate-pulse">
                          <MapPin className="w-4 h-4" />
                          Sekarang
                        </div>
                      )}
                    </div>

                    {/* Region Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {region.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">
                        {region.description}
                      </p>
                      <div className="flex items-center gap-2 text-white/80 text-xs">
                        <span>{region.challenges} Tantangan</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {unlocked && (
                    <div className="p-4 bg-card">
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        {completed ? 'Ulangi Region' : 'Masuki Region'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Connector Line */}
                {index < regions.length - 1 && (
                  <div className="hidden md:block absolute top-32 -right-4 w-8 h-0.5 bg-primary/30 z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
