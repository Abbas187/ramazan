import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ChevronLeft, BellRing } from 'lucide-react';
import { format, parse, isAfter, addMinutes } from 'date-fns';

interface PrayerTimesProps {
    location: { city: string; country: string } | null;
    onBack: () => void;
}

interface Prayer {
    name: string;
    time: string;
    completed: boolean;
    reminderSent: boolean;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onBack }) => {
    const [prayers, setPrayers] = useState<Prayer[]>(() => {
        const saved = localStorage.getItem('dailyPrayers_v2');
        const today = format(new Date(), 'yyyy-MM-dd');
        const savedDate = localStorage.getItem('lastPrayerDate_v2');

        if (savedDate === today && saved) return JSON.parse(saved);

        // Specific Hardcoded Timings
        return [
            { name: 'Fajr', time: '05:50', completed: false, reminderSent: false },
            { name: 'Dhuhr', time: '13:30', completed: false, reminderSent: false },
            { name: 'Asr', time: '16:45', completed: false, reminderSent: false },
            { name: 'Maghrib', time: '18:25', completed: false, reminderSent: false }, // Placeholder for Iftar + 15
            { name: 'Isha', time: '19:45', completed: false, reminderSent: false },
        ];
    });

    useEffect(() => {
        localStorage.setItem('dailyPrayers_v2', JSON.stringify(prayers));
        localStorage.setItem('lastPrayerDate_v2', format(new Date(), 'yyyy-MM-dd'));
    }, [prayers]);

    const togglePrayer = (index: number) => {
        const newPrayers = [...prayers];
        newPrayers[index].completed = !newPrayers[index].completed;
        setPrayers(newPrayers);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                    <ChevronLeft />
                </button>
                <h2 className="text-2xl gold-glow font-bold">Prayer Times</h2>
            </div>

            <div className="premium-card p-4 space-y-3">
                {prayers.map((prayer, index) => (
                    <motion.button
                        key={prayer.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => togglePrayer(index)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all relative overflow-hidden group ${prayer.completed
                                ? 'bg-emerald/20 border-emerald-glow/30'
                                : 'bg-white/5 border-white/10 hover:border-primary-gold/30'
                            }`}
                    >
                        {prayer.completed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-emerald-glow/5 pointer-events-none shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]"
                            />
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-2 rounded-full transition-colors ${prayer.completed ? 'bg-emerald-glow text-midnight-teal' : 'bg-white/10 text-text-secondary'}`}>
                                {prayer.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </div>
                            <div className="text-left">
                                <p className={`text-lg font-bold ${prayer.completed ? 'text-emerald-glow' : 'text-text-primary'}`}>
                                    {prayer.name}
                                </p>
                                <div className="flex items-center gap-1.5 text-text-secondary mt-0.5">
                                    <Clock size={12} className="text-primary-gold" />
                                    <span className="text-xs font-medium">{prayer.time}</span>
                                </div>
                            </div>
                        </div>

                        {!prayer.completed && (
                            <div className="relative z-10 p-2 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-text-secondary uppercase tracking-widest group-hover:text-primary-gold transition-colors">
                                Check
                            </div>
                        )}

                        {prayer.completed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10 px-3 py-1 bg-emerald-glow/20 rounded-full text-[9px] font-bold text-emerald-glow uppercase tracking-widest"
                            >
                                Allah Accepted
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="premium-card p-6 border-emerald-glow/20 flex items-center gap-4">
                <div className="p-3 bg-emerald-glow/10 rounded-2xl text-emerald-glow">
                    <BellRing size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-text-primary leading-tight">Post-Prayer Reminders</h4>
                    <p className="text-[10px] text-text-secondary mt-1 leading-relaxed">
                        We will nudge you 30 minutes after each prayer time to ensure you stay on track with your goals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
