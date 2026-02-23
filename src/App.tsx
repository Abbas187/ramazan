import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  BookOpen, 
  Hash, 
  Bell, 
  MapPin,
  Clock as ClockIcon
} from 'lucide-react';
import PrayerTimes from './components/PrayerTimes';
import QuranReader from './components/QuranReader';
import ZikrCounter from './components/ZikrCounter';
import Reminders from './components/Reminders';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'quran' | 'zikr'>('prayers');
  const [currentLocation, setCurrentLocation] = useState<{city: string, country: string} | null>(null);

  useEffect(() => {
    // Default location for now, could use Geolocation API later
    setCurrentLocation({ city: 'Lahore', country: 'Pakistan' });
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <header className="p-6 flex justify-between items-center max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <Moon className="text-primary-gold w-8 h-8" />
          <div>
            <h1 className="text-2xl gold-text">Ramazan Companion</h1>
            <p className="text-xs text-text-secondary">Blessed Month of Reflection</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary glass-card px-3 py-1">
          <MapPin size={14} className="text-primary-gold" />
          <span>{currentLocation?.city || 'Loading...'}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4">
        {activeTab === 'prayers' && (
          <div className="space-y-6">
            <Reminders location={currentLocation} />
            <PrayerTimes location={currentLocation} />
          </div>
        )}
        {activeTab === 'quran' && <QuranReader />}
        {activeTab === 'zikr' && <ZikrCounter />}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card flex gap-8 px-8 py-4 z-50">
        <button 
          onClick={() => setActiveTab('prayers')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'prayers' ? 'text-primary-gold' : 'text-text-secondary'}`}
        >
          <ClockIcon size={24} />
          <span className="text-[10px] font-medium">Prayers</span>
        </button>
        <button 
          onClick={() => setActiveTab('quran')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'quran' ? 'text-primary-gold' : 'text-text-secondary'}`}
        >
          <BookOpen size={24} />
          <span className="text-[10px] font-medium">Quran</span>
        </button>
        <button 
          onClick={() => setActiveTab('zikr')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'zikr' ? 'text-primary-gold' : 'text-text-secondary'}`}
        >
          <Hash size={24} />
          <span className="text-[10px] font-medium">Zikr</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
