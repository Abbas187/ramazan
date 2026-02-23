import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Trash2, ChevronLeft, Fingerprint, Sparkles } from 'lucide-react';

interface Zikr {
    id: string;
    name: string;
    count: number;
}

interface ZikrProps {
    onBack: () => void;
}

const ZikrCounter: React.FC<ZikrProps> = ({ onBack }) => {
    const [zikrs, setZikrs] = useState<Zikr[]>(() => {
        const saved = localStorage.getItem('zikrList_v2');
        return saved ? JSON.parse(saved) : [
            { id: '1', name: 'SubhanAllah', count: 0 },
            { id: '2', name: 'Alhamdulillah', count: 0 },
            { id: '3', name: 'Allahu Akbar', count: 0 }
        ];
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [showAdd, setShowAdd] = useState(false);
    const [newZikrName, setNewZikrName] = useState('');

    useEffect(() => {
        localStorage.setItem('zikrList_v2', JSON.stringify(zikrs));
    }, [zikrs]);

    const increment = () => {
        const newList = [...zikrs];
        newList[activeIndex].count += 1;
        setZikrs(newList);
        if ('vibrate' in navigator) navigator.vibrate(40);
    };

    const reset = () => {
        const newList = [...zikrs];
        newList[activeIndex].count = 0;
        setZikrs(newList);
    };

    const currentZikr = zikrs[activeIndex];

    return (
        <div className="space-y-8 flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                        <ChevronLeft />
                    </button>
                    <h2 className="text-2xl gold-glow font-bold">Digital Tasbeeh</h2>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="p-2 bg-primary-gold/10 rounded-xl border border-primary-gold/20 text-primary-gold"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Main Counter Disk */}
            <div className="relative group w-full flex justify-center py-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 w-72 h-72 rounded-full premium-card flex flex-col items-center justify-center p-4 border-[6px] border-emerald/50 shadow-[0_0_80px_rgba(16,185,129,0.15)] aura-tap overflow-hidden"
                    onClick={increment}
                >
                    <div className="absolute top-12 text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">{currentZikr.name}</div>
                    <motion.h2
                        key={currentZikr.count}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-7xl font-bold gold-glow mt-4"
                    >
                        {currentZikr.count}
                    </motion.h2>
                    <div className="absolute bottom-12 flex flex-col items-center gap-1.5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <Fingerprint className="text-emerald-glow" size={32} />
                        <span className="text-[8px] font-bold text-emerald-glow uppercase tracking-[0.2em]">Touch Interface</span>
                    </div>
                </motion.div>

                {/* Glow Pulses */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-glow/10 rounded-full blur-[60px] -z-1"
                />
            </div>

            <div className="w-full space-y-4">
                <div className="flex gap-4">
                    <button onClick={reset} className="flex-1 premium-card py-4 flex items-center justify-center gap-2 text-text-secondary hover:text-primary-gold transition-colors">
                        <RotateCcw size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Reset</span>
                    </button>
                    <button className="flex-1 premium-card py-4 flex items-center justify-center gap-2 text-text-secondary hover:text-red-400 transition-colors">
                        <Trash2 size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Delete</span>
                    </button>
                </div>

                <div className="flex gap-3 overflow-x-auto p-1 noscroll pb-8">
                    {zikrs.map((zikr, idx) => (
                        <motion.button
                            key={zikr.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveIndex(idx)}
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-bold shadow-lg border transition-all ${activeIndex === idx
                                    ? 'bg-primary-gold text-midnight-teal border-primary-gold shadow-primary-gold/20'
                                    : 'premium-card border-white/5 text-text-secondary'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className={activeIndex === idx ? 'opacity-100' : 'opacity-0'} />
                                {zikr.name}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-x-0 bottom-24 p-6 z-[60]"
                    >
                        <div className="premium-card p-6 shadow-2xl border-primary-gold/40">
                            <h4 className="text-lg font-bold mb-4">Add New Zikr</h4>
                            <div className="flex gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newZikrName}
                                    onChange={(e) => setNewZikrName(e.target.value)}
                                    placeholder="SubhanAllah Wa Bihamdihi..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                                />
                                <button
                                    onClick={() => {
                                        if (!newZikrName) return;
                                        setZikrs([...zikrs, { id: Date.now().toString(), name: newZikrName, count: 0 }]);
                                        setNewZikrName('');
                                        setShowAdd(false);
                                        setActiveIndex(zikrs.length);
                                    }}
                                    className="bg-primary-gold text-midnight-teal font-bold px-6 rounded-xl text-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ZikrCounter;
