import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, Play, Activity } from 'lucide-react';
import { motion } from 'motion/react';

// Hardcoded challenges for demonstration, simulating an AI-generated daily pool
const DAILY_CHALLENGES = [
  { id: 1, title: 'Meatless Monday', desc: 'Go vegetarian for one day to drastically reduce water usage and methane emissions.', save: 1.5, cat: 'Food', points: 50 },
  { id: 2, title: 'Phantom Power Purge', desc: 'Unplug all electronics and appliances not actively in use this evening.', save: 0.3, cat: 'Energy', points: 15 },
  { id: 3, title: 'Cold Wash', desc: 'Wash your laundry in cold water to save heating energy.', save: 0.8, cat: 'Home', points: 25 },
  { id: 4, title: 'Public Transit Day', desc: 'Take a bus or train instead of driving solo.', save: 2.4, cat: 'Transport', points: 60 },
  { id: 5, title: 'No-AC Hour', desc: 'Turn off the air conditioning for exactly one hour during peak afternoon.', save: 0.5, cat: 'Energy', points: 20 },
];

export default function Challenges() {
  const [filter, setFilter] = useState('All');
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [streak, setStreak] = useState(12);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('eco_completed_challenges') || '[]');
    setCompletedIds(saved);
  }, []);

  const handleComplete = (challenge: any) => {
    if (completedIds.includes(challenge.id)) return;
    
    // Add to completion array
    const newCompleted = [...completedIds, challenge.id];
    setCompletedIds(newCompleted);
    localStorage.setItem('eco_completed_challenges', JSON.stringify(newCompleted));

    // Simulate pushing saving to user's virtual score
    const currentScore = parseInt(localStorage.getItem('eco_user_points') || '1250');
    localStorage.setItem('eco_user_points', (currentScore + challenge.points).toString());

    // Increase streak if it's their first today
    if (newCompleted.length === 1) {
      setStreak(s => s + 1);
    }
  };

  const filteredChallenges = DAILY_CHALLENGES.filter(c => filter === 'All' || c.cat === filter);

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col pt-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h1 className="text-2xl font-black tracking-tight">Daily Quests</h1>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10">
          <Settings size={20} />
        </button>
      </div>

      <div className="px-6 mb-4">
        <p className="text-sm text-gray-400 font-medium">Complete algorithmic micro-challenges to algorithmically boost your state ranking.</p>
      </div>

      {/* Daily Streak */}
      <div className="mx-6 bg-gradient-to-r from-orange-500/20 to-red-500/10 p-5 rounded-3xl border border-orange-500/20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-tight">{streak} Day Streak</div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">Top 8% Consistency</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center bg-black/40 p-2 rounded-2xl">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < 4 ? 'bg-[#00FF00] text-black shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 
                i === 4 ? (completedIds.length > 0 ? 'bg-[#00FF00] text-black' : 'bg-white text-black') : 
                'bg-white/5 text-gray-500'
              }`}
            >
              {i < 4 || (i === 4 && completedIds.length > 0) ? '✓' : day}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 my-6 px-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Energy', 'Food', 'Transport', 'Home'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === item 
                ? 'bg-[#00FF00] text-black shadow-md' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 px-6">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">Today's Missions</h3>
          <div className="space-y-3">
            {filteredChallenges.map((item) => {
              const isCompleted = completedIds.includes(item.id);
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-3xl border transition-all ${isCompleted ? 'bg-[#00FF00]/5 border-[#00FF00]/20' : 'bg-[#151F16] border-white/5 hover:bg-[#1A261C]'}`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-sm font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{item.title}</h4>
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-black/40 px-2 py-0.5 rounded-lg">{item.cat}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[250px] mb-3">{item.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#00FF00] bg-[#00FF00]/10 px-2 py-1 rounded-md">-{item.save} kg CO₂</span>
                        <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">+{item.points} PTS</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleComplete(item)}
                      disabled={isCompleted}
                      className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-[#00FF00]/20 text-[#00FF00]' 
                          : 'bg-white/10 text-white hover:bg-[#00FF00] hover:text-black hover:scale-110 active:scale-95'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={24} /> : <Play size={20} className="ml-1" fill={isCompleted ? "none" : "currentColor"} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
