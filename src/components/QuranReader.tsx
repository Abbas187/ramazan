import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, Bookmark, History, Search, List, Grid } from 'lucide-react';
import { getQuranJuz } from '../services/api';

const SURAHS = [
    { id: 1, name: 'Al-Fatihah', english: 'The Opening', verses: 7 },
    { id: 2, name: 'Al-Baqarah', english: 'The Cow', verses: 286 },
    { id: 3, name: 'Ali Imran', english: 'Family of Imran', verses: 200 },
    { id: 4, name: 'An-Nisa', english: 'The Women', verses: 176 },
    { id: 5, name: 'Al-Maidah', english: 'The Table Spread', verses: 120 },
    { id: 6, name: 'Al-Anam', english: 'The Cattle', verses: 165 },
    { id: 7, name: 'Al-Araf', english: 'The Heights', verses: 206 },
    { id: 8, name: 'Al-Anfal', english: 'The Spoils of War', verses: 75 },
    { id: 9, name: 'At-Tawbah', english: 'The Repentance', verses: 129 },
    { id: 10, name: 'Yunus', english: 'Jonah', verses: 109 }
    // ... Truncated for brevity, normally all 114
];

interface QuranProps {
    onBack: () => void;
}

const QuranReader: React.FC<QuranProps> = ({ onBack }) => {
    const [mode, setMode] = useState<'surah' | 'juz'>('surah');
    const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
    const [selectedSurah, setSelectedSurah] = useState<any>(null);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (selectedJuz) fetchJuz(selectedJuz);
    }, [selectedJuz]);

    const fetchJuz = async (juzNum: number) => {
        setLoading(true);
        const data = await getQuranJuz(juzNum);
        if (data) setContent(data);
        setLoading(false);
    };

    const filteredSurahs = SURAHS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.english.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                        <ChevronLeft />
                    </button>
                    <h2 className="text-2xl gold-glow font-bold">Holy Quran</h2>
                </div>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                        onClick={() => setMode('surah')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${mode === 'surah' ? 'bg-primary-gold text-midnight-teal' : 'text-text-secondary'}`}
                    >
                        Surah
                    </button>
                    <button
                        onClick={() => setMode('juz')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${mode === 'juz' ? 'bg-primary-gold text-midnight-teal' : 'text-text-secondary'}`}
                    >
                        Juz
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!content ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${mode === 'surah' ? 'Surah' : 'Juz'}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary-gold/50 transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto noscroll pb-12">
                            {mode === 'surah' ? filteredSurahs.map((surah) => (
                                <button
                                    key={surah.id}
                                    onClick={() => setSelectedSurah(surah)}
                                    className="w-full premium-card p-4 flex items-center justify-between hover:border-primary-gold/40 transition-all aura-tap"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold font-bold text-sm border border-primary-gold/20">
                                            {surah.id}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-text-primary leading-tight">{surah.name}</p>
                                            <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">{surah.english} • {surah.verses} Verses</p>
                                        </div>
                                    </div>
                                    <BookOpen size={18} className="text-text-secondary opacity-30" />
                                </button>
                            )) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {[...Array(30)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedJuz(i + 1)}
                                            className="aspect-square premium-card flex flex-col items-center justify-center gap-1 hover:border-primary-gold/40"
                                        >
                                            <span className="text-xs text-text-secondary font-bold uppercase tracking-tighter">Juz</span>
                                            <span className="text-xl font-bold text-primary-gold">{i + 1}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reader"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="premium-card p-6 min-h-[400px] relative">
                            <button
                                onClick={() => setContent(null)}
                                className="absolute top-4 left-4 p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary z-20"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="text-center mb-8 pt-4">
                                <h3 className="gold-glow text-lg font-bold">Juz {selectedJuz}</h3>
                                <p className="text-[9px] text-text-secondary uppercase tracking-[0.3em]">Reading Progress Tracked</p>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-12 h-12 border-4 border-primary-gold/10 border-t-primary-gold rounded-full animate-spin" />
                                    <p className="text-xs text-text-secondary animate-pulse uppercase tracking-widest">Divine Wisdom Loading...</p>
                                </div>
                            ) : (
                                <div className="arabic-text text-3xl text-right dir-rtl leading-[2.5] text-text-primary px-2" dir="rtl">
                                    {content.ayahs.map((ayah: any) => (
                                        <span key={ayah.number} className="hover:text-primary-gold transition-colors inline-block mr-2">
                                            {ayah.text} <span className="text-primary-gold text-lg font-bold border border-primary-gold/20 rounded-full px-2 py-0.5 mx-1">۝</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuranReader;
