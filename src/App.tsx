import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  BookOpen,
  Hash,
  Clock,
  LayoutGrid,
  MapPin,
  Settings
} from 'lucide-react';
import PrayerTimes from './components/PrayerTimes';
import QuranReader from './components/QuranReader';
import ZikrCounter from './components/ZikrCounter';
import Reminders from './components/Reminders';

type ViewMode = 'prayers' | 'quran' | 'zikr' | 'home';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [location] = useState({ city: 'Lahore', country: 'Pakistan' });

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed top-[-10%] left-[-10%] w-80 h-80 bg-emerald-glow/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-80 h-80 bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative z-10 px-6 pt-8 pb-4 flex justify-between items-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
          onClick={() => setView('home')}
        >
          <div className="p-2 bg-emerald/30 rounded-xl border border-glass-border">
            <Moon className="text-primary-gold w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl gold-glow font-bold leading-none">Ramazan</h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Companion</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <MapPin size={12} className="text-primary-gold" />
            <span>{location.city}</span>
          </div>
          <button className="p-2 bg-white/5 rounded-full border border-white/10 text-text-secondary">
            <Settings size={18} />
          </button>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Reminders location={location} />

              <div className="grid grid-cols-2 gap-4">
                <MenuButton
                  icon={<Clock className="w-8 h-8" />}
                  label="Prayers"
                  desc="Checklist & Times"
                  onClick={() => setView('prayers')}
                  color="emerald"
                />
                <MenuButton
                  icon={<BookOpen className="w-8 h-8" />}
                  label="Quran"
                  desc="Read & Track"
                  onClick={() => setView('quran')}
                  color="gold"
                />
                <MenuButton
                  icon={<Hash className="w-8 h-8" />}
                  label="Zikr"
                  desc="Digital Tasbeeh"
                  onClick={() => setView('zikr')}
                  color="gold"
                  fullWidth
                />
              </div>
            </motion.div>
          )}

          {view === 'prayers' && (
            <motion.div
              key="prayers"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PrayerTimes location={location} onBack={() => setView('home')} />
            </motion.div>
          )}

          {view === 'quran' && (
            <motion.div
              key="quran"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <QuranReader onBack={() => setView('home')} />
            </motion.div>
          )}

          {view === 'zikr' && (
            <motion.div
              key="zikr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ZikrCounter onBack={() => setView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-sm premium-card py-3 px-6 flex justify-between items-center z-50">
        <NavIcon active={view === 'home'} onClick={() => setView('home')} icon={<LayoutGrid size={22} />} label="Home" />
        <NavIcon active={view === 'prayers'} onClick={() => setView('prayers')} icon={<Clock size={22} />} label="Prayers" />
        <NavIcon active={view === 'quran'} onClick={() => setView('quran')} icon={<BookOpen size={22} />} label="Quran" />
        <NavIcon active={view === 'zikr'} onClick={() => setView('zikr')} icon={<Hash size={22} />} label="Zikr" />
      </nav>
    </div>
  );
};

const MenuButton: React.FC<{
  icon: React.ReactNode,
  label: string,
  desc: string,
  onClick: () => void,
  color: 'emerald' | 'gold',
  fullWidth?: boolean
}> = ({ icon, label, desc, onClick, color, fullWidth }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${fullWidth ? 'col-span-2' : ''} premium-card p-6 flex flex-col items-start gap-4 text-left aura-tap`}
  >
    <div className={`p-3 rounded-2xl ${color === 'emerald' ? 'bg-emerald/30 text-emerald-glow shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-primary-gold/10 text-primary-gold shadow-[0_0_20px_rgba(251,191,36,0.1)]'}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-text-primary leading-none">{label}</h3>
      <p className="text-[10px] text-text-secondary mt-1.5 uppercase tracking-wider">{desc}</p>
    </div>
  </motion.button>
);

const NavIcon: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'nav-active' : 'text-text-secondary opacity-50'}`}>
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
