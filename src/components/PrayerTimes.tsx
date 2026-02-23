import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Bell } from 'lucide-react';
import { format, addMinutes, isAfter, parse } from 'date-fns';
import { getPrayerTimes } from '../services/api';

interface PrayerTimesProps {
    location: { city: string; country: string } | null;
}

interface Prayer {
    name: string;
    time: string;
    completed: boolean;
    reminderSent: boolean;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ location }) => {
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!location) return;

            const savedPrayers = localStorage.getItem('dailyPrayers');
            const today = format(new Date(), 'yyyy-MM-dd');
            const savedDate = localStorage.getItem('lastPrayerDate');

            if (savedDate === today && savedPrayers) {
                setPrayers(JSON.parse(savedPrayers));
                setLoading(false);
                return;
            }

            const times = await getPrayerTimes(location.city, location.country);
            if (times) {
                const prayerList: Prayer[] = [
                    { name: 'Fajr', time: times.Fajr, completed: false, reminderSent: false },
                    { name: 'Dhuhr', time: times.Dhuhr, completed: false, reminderSent: false },
                    { name: 'Asr', time: times.Asr, completed: false, reminderSent: false },
                    { name: 'Maghrib', time: times.Maghrib, completed: false, reminderSent: false },
                    { name: 'Isha', time: times.Isha, completed: false, reminderSent: false },
                ];
                setPrayers(prayerList);
                localStorage.setItem('dailyPrayers', JSON.stringify(prayerList));
                localStorage.setItem('lastPrayerDate', today);
            }
            setLoading(false);
        };

        fetchTimes();
    }, [location]);

    // Check for 30-minute follow-ups
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const updatedPrayers = prayers.map(prayer => {
                if (!prayer.completed && !prayer.reminderSent) {
                    const prayerTime = parse(prayer.time, 'HH:mm', new Date());
                    const reminderTime = addMinutes(prayerTime, 30);

                    if (isAfter(now, reminderTime)) {
                        // In a real app, this would trigger a notification
                        console.log(`Reminder: Did you pray ${prayer.name}?`);
                        return { ...prayer, reminderSent: true };
                    }
                }
                return prayer;
            });

            if (JSON.stringify(updatedPrayers) !== JSON.stringify(prayers)) {
                setPrayers(updatedPrayers);
                localStorage.setItem('dailyPrayers', JSON.stringify(updatedPrayers));
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [prayers]);

    const togglePrayer = (index: number) => {
        const newPrayers = [...prayers];
        newPrayers[index].completed = !newPrayers[index].completed;
        setPrayers(newPrayers);
        localStorage.setItem('dailyPrayers', JSON.stringify(newPrayers));
    };

    if (loading) return <div className="p-8 text-center text-primary-gold">Calculating Prayer Times...</div>;

    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl gold-text flex items-center gap-2">
                    <Clock className="text-primary-gold" size={20} />
                    Daily Prayers
                </h2>
                <span className="text-xs text-text-secondary">{format(new Date(), 'EEEE, do MMMM')}</span>
            </div>

            <div className="space-y-3">
                {prayers.map((prayer, index) => (
                    <button
                        key={prayer.name}
                        onClick={() => togglePrayer(index)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${prayer.completed
                                ? 'bg-emerald/30 border-emerald text-emerald-light'
                                : 'bg-white/5 border-glass-border hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {prayer.completed ? (
                                <CheckCircle2 size={24} className="text-emerald-light" />
                            ) : (
                                <Circle size={24} className="text-text-secondary" />
                            )}
                            <div className="text-left">
                                <p className={`font-semibold ${prayer.completed ? 'text-emerald-light' : 'text-text-primary'}`}>
                                    {prayer.name}
                                </p>
                                <p className="text-xs text-text-secondary">{prayer.time}</p>
                            </div>
                        </div>
                        {prayer.reminderSent && !prayer.completed && (
                            <div className="flex items-center gap-1 text-[10px] text-primary-gold animate-pulse">
                                <Bell size={12} />
                                <span>Follow-up</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PrayerTimes;
