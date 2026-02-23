import React, { useState, useEffect } from 'react';
import { format, differenceInSeconds, parse, addDays, isAfter } from 'date-fns';
import { Bell, Coffee, Sunrise } from 'lucide-react';
import { getPrayerTimes } from '../services/api';

interface RemindersProps {
    location: { city: string; country: string } | null;
}

const Reminders: React.FC<RemindersProps> = ({ location }) => {
    const [times, setTimes] = useState<{ sehr: string; iftar: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ label: string; time: string } | null>(null);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!location) return;
            const data = await getPrayerTimes(location.city, location.country);
            if (data) {
                setTimes({ sehr: data.Fajr, iftar: data.Maghrib });
            }
        };
        fetchTimes();
    }, [location]);

    useEffect(() => {
        if (!times) return;

        const timer = setInterval(() => {
            const now = new Date();
            const sehrTime = parse(times.sehr, 'HH:mm', new Date());
            const iftarTime = parse(times.iftar, 'HH:mm', new Date());

            let target: Date;
            let label: string;

            if (isAfter(now, iftarTime)) {
                // Next Sehr
                target = addDays(sehrTime, 1);
                label = "Next Sehr in";
            } else if (isAfter(now, sehrTime)) {
                // Next Iftar
                target = iftarTime;
                label = "Iftar in";
            } else {
                // Today's Sehr
                target = sehrTime;
                label = "Sehr in";
            }

            const diff = differenceInSeconds(target, now);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;

            setTimeLeft({
                label,
                time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [times]);

    if (!timeLeft) return null;

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="glass-card p-6 flex items-center justify-between overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {timeLeft.label.includes("Iftar") ? <Coffee size={120} /> : <Sunrise size={120} />}
                </div>

                <div className="relative z-10">
                    <p className="text-secondary-gold font-medium text-sm flex items-center gap-2">
                        <Bell size={14} className="animate-bounce" />
                        {timeLeft.label}
                    </p>
                    <h2 className="text-4xl font-bold gold-text mt-1">{timeLeft.time}</h2>
                </div>

                <div className="text-right relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">Today's Times</p>
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-semibold flex items-center gap-2">
                                <span className="text-xs text-text-secondary">Sehr</span>
                                <span className="text-primary-gold">{times?.sehr}</span>
                            </p>
                            <p className="text-sm font-semibold flex items-center gap-2">
                                <span className="text-xs text-text-secondary">Iftar</span>
                                <span className="text-primary-gold">{times?.iftar}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reminders;
