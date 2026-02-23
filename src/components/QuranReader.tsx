import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Bookmark, History, Search } from 'lucide-react';
import { getQuranJuz } from '../services/api';

interface RecitationRecord {
    date: string;
    juz: number;
    para?: number;
    amount: string;
}

const QuranReader: React.FC = () => {
    const [juz, setJuz] = useState(1);
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [records, setRecords] = useState<RecitationRecord[]>(() => {
        const saved = localStorage.getItem('quranRecords');
        return saved ? JSON.parse(saved) : [];
    });

    const [recitedToday, setRecitedToday] = useState('');

    useEffect(() => {
        fetchJuz(juz);
    }, [juz]);

    const fetchJuz = async (juzNum: number) => {
        setLoading(true);
        const data = await getQuranJuz(juzNum);
        if (data) {
            setContent(data);
        }
        setLoading(false);
    };

    const saveRecord = () => {
        if (!recitedToday.trim()) return;
        const newRecord: RecitationRecord = {
            date: new Date().toLocaleDateString(),
            juz: juz,
            amount: recitedToday
        };
        const updated = [newRecord, ...records];
        setRecords(updated);
        localStorage.setItem('quranRecords', JSON.stringify(updated));
        setRecitedToday('');
        alert('Recitation recorded successfully!');
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-4 flex gap-4 overflow-x-auto noscroll">
                {[...Array(30)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setJuz(i + 1)}
                        className={`min-w-[60px] h-[60px] rounded-xl flex items-center justify-center transition-all ${juz === i + 1
                                ? 'bg-primary-gold text-dark-bg font-bold'
                                : 'bg-white/5 text-text-secondary border border-glass-border'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 min-h-[400px] relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-gold"></div>
                    </div>
                ) : content ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-glass-border pb-4">
                            <h2 className="gold-text text-xl">Juz {juz}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setJuz(Math.max(1, juz - 1))}
                                    className="p-2 glass-card hover:bg-white/10"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setJuz(Math.min(30, juz + 1))}
                                    className="p-2 glass-card hover:bg-white/10"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="arabic-text text-3xl leading-[2.5] text-right" dir="rtl">
                            {content.ayahs.map((ayah: any) => (
                                <span key={ayah.number} className="hover:text-primary-gold transition-colors cursor-pointer">
                                    {ayah.text} <span className="text-secondary-gold text-sm mx-1">({ayah.numberInSurah})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-text-secondary py-20">Select a Juz to start reciting</div>
                )}
            </div>

            <div className="glass-card p-6 space-y-4">
                <h3 className="gold-text flex items-center gap-2">
                    <Bookmark size={18} />
                    Track Your Progress
                </h3>
                <div className="space-y-3">
                    <p className="text-sm text-text-secondary">How much did you recite today?</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g., 5 pages, 2 surahs..."
                            value={recitedToday}
                            onChange={(e) => setRecitedToday(e.target.value)}
                            className="flex-1 bg-white/5 border border-glass-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-gold"
                        />
                        <button onClick={saveRecord} className="gold-button">Save</button>
                    </div>
                </div>

                {records.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-xs font-bold text-secondary-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <History size={14} />
                            Recent Records
                        </h4>
                        <div className="space-y-2">
                            {records.slice(0, 3).map((record, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-glass-border/50">
                                    <div>
                                        <p className="text-sm font-medium">Juz {record.juz}</p>
                                        <p className="text-[10px] text-text-secondary">{record.date}</p>
                                    </div>
                                    <span className="text-xs bg-emerald/20 text-emerald-light px-2 py-1 rounded truncate max-w-[100px]">
                                        {record.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranReader;
