import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Save, Trash2 } from 'lucide-react';

interface Zikr {
    id: string;
    name: string;
    count: number;
    target?: number;
}

const ZikrCounter: React.FC = () => {
    const [zikrs, setZikrs] = useState<Zikr[]>(() => {
        const saved = localStorage.getItem('zikrList');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'SubhanAllah', count: 0 },
            { id: '2', name: 'Alhamdulillah', count: 0 },
            { id: '3', name: 'Allahu Akbar', count: 0 }
        ];
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [newZikrName, setNewZikrName] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        localStorage.setItem('zikrList', JSON.stringify(zikrs));
    }, [zikrs]);

    const increment = () => {
        const newList = [...zikrs];
        newList[activeIndex].count += 1;
        setZikrs(newList);
        if ('vibrate' in navigator) navigator.vibrate(50); // Haptic feedback if available
    };

    const reset = () => {
        const newList = [...zikrs];
        newList[activeIndex].count = 0;
        setZikrs(newList);
    };

    const addZikr = () => {
        if (!newZikrName.trim()) return;
        const newZikr = {
            id: Date.now().toString(),
            name: newZikrName,
            count: 0
        };
        setZikrs([...zikrs, newZikr]);
        setNewZikrName('');
        setShowAdd(false);
        setActiveIndex(zikrs.length);
    };

    const deleteZikr = (id: string) => {
        if (zikrs.length === 1) return;
        const newList = zikrs.filter(z => z.id !== id);
        setZikrs(newList);
        setActiveIndex(0);
    };

    const currentZikr = zikrs[activeIndex];

    return (
        <div className="space-y-6">
            <div
                className="glass-card aspect-square max-w-[320px] mx-auto flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform border-4 border-emerald/50"
                onClick={increment}
            >
                <p className="text-secondary-gold uppercase tracking-[0.2em] text-sm mb-2">{currentZikr.name}</p>
                <h2 className="text-7xl font-bold gold-text">{currentZikr.count}</h2>
                <p className="text-text-secondary mt-4 animate-pulse uppercase text-[10px] tracking-widest">Tap to count</p>
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={reset} className="glass-card p-3 text-text-secondary hover:text-primary-gold transition-colors">
                    <RotateCcw size={20} />
                </button>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="glass-card p-3 text-text-secondary hover:text-primary-gold transition-colors"
                >
                    <Plus size={20} />
                </button>
                <button
                    onClick={() => deleteZikr(currentZikr.id)}
                    className="glass-card p-3 text-text-secondary hover:text-red-400 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {showAdd && (
                <div className="glass-card p-4 flex gap-2">
                    <input
                        type="text"
                        value={newZikrName}
                        onChange={(e) => setNewZikrName(e.target.value)}
                        placeholder="Enter Zikr Name..."
                        className="flex-1 bg-white/5 border border-glass-border rounded-lg px-3 text-sm focus:outline-none focus:border-primary-gold"
                    />
                    <button onClick={addZikr} className="gold-button !py-2 !px-4 text-xs">Add</button>
                </div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 noscroll">
                {zikrs.map((zikr, idx) => (
                    <button
                        key={zikr.id}
                        onClick={() => setActiveIndex(idx)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs transition-all ${activeIndex === idx
                                ? 'bg-primary-gold text-dark-bg font-bold'
                                : 'glass-card text-text-secondary'
                            }`}
                    >
                        {zikr.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ZikrCounter;
