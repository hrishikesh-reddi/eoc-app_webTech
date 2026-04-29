import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const navigate = useNavigate();
  const [target, setTarget] = useState(20);
  const [diet, setDiet] = useState('Vegetarian');
  const [energy, setEnergy] = useState('Green Energy Plan');

  const diets = [
    { id: 'Omnivore', label: 'Omnivore', desc: 'Eat everything', icon: '🍴' },
    { id: 'Vegetarian', label: 'Vegetarian', desc: 'No meat', icon: '🥦' },
    { id: 'Pescatarian', label: 'Pescatarian', desc: 'Fish, no meat', icon: '🐟' },
    { id: 'Vegan', label: 'Vegan', desc: 'Plant-based only', icon: '🌱' },
  ];

  const energySources = [
    { id: 'Standard Grid', label: 'Standard Grid', desc: 'Mixed sources' },
    { id: 'Green Energy Plan', label: 'Green Energy Plan', desc: 'Recommended', recommended: true },
    { id: 'Solar Panels', label: 'Solar Panels', desc: 'Self-generated' },
  ];

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col px-6 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Set Your Goals</h1>
        <button onClick={() => navigate('/report')} className="text-sm font-medium text-[#00FF00]">Skip</button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>Step 2 of 4</span>
        <span className="text-[#00FF00]">50%</span>
      </div>
      <div className="h-1 w-full bg-gray-800 rounded-full mb-8">
        <div className="h-full w-1/2 bg-[#00FF00] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-24"
      >
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Reduce your carbon footprint</h2>
          <p className="text-gray-400 text-sm">Let's set a realistic target for your first year. Small steps lead to big changes.</p>
        </div>

        {/* Target Slider */}
        <div className="bg-[#151F16] p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-end mb-6">
            <span className="text-sm font-medium text-gray-300">Target Reduction</span>
            <span className="text-3xl font-bold text-[#00FF00]">{target}%</span>
          </div>
          
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={target} 
            onChange={(e) => setTarget(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00FF00]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5%</span>
            <span>50%</span>
          </div>

          <div className="mt-6 bg-[#00FF00]/10 border border-[#00FF00]/20 p-3 rounded-xl flex items-start gap-3">
            <div className="mt-0.5 text-[#00FF00]">ℹ️</div>
            <p className="text-xs text-[#00FF00]/90 leading-relaxed">
              A {target}% reduction is equivalent to saving {Math.round(target * 0.2)} trees per year!
            </p>
          </div>
        </div>

        {/* Diet Selection */}
        <div>
          <h3 className="text-sm font-bold text-gray-300 mb-4">Refine your profile</h3>
          <p className="text-xs text-gray-500 mb-4">Which best describes your diet?</p>
          
          <div className="grid grid-cols-2 gap-3">
            {diets.map((item) => (
              <button
                key={item.id}
                onClick={() => setDiet(item.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all relative overflow-hidden",
                  diet === item.id 
                    ? "bg-[#00FF00] border-[#00FF00] text-black" 
                    : "bg-[#151F16] border-white/5 text-gray-300 hover:border-white/20"
                )}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm">{item.label}</div>
                <div className={cn("text-xs mt-0.5", diet === item.id ? "text-black/70" : "text-gray-500")}>
                  {item.desc}
                </div>
                {diet === item.id && (
                  <div className="absolute top-3 right-3 bg-black/20 p-1 rounded-full">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Source */}
        <div>
          <p className="text-xs text-gray-500 mb-4">Primary home energy source?</p>
          <div className="space-y-3">
            {energySources.map((item) => (
              <button
                key={item.id}
                onClick={() => setEnergy(item.id)}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                  energy === item.id 
                    ? "bg-[#151F16] border-[#00FF00]" 
                    : "bg-[#151F16] border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    energy === item.id ? "border-[#00FF00]" : "border-gray-600"
                  )}>
                    {energy === item.id && <div className="w-2.5 h-2.5 bg-[#00FF00] rounded-full" />}
                  </div>
                  <span className={cn("text-sm font-medium", energy === item.id ? "text-white" : "text-gray-400")}>
                    {item.label}
                  </span>
                </div>
                {item.recommended && (
                  <span className="text-[10px] font-bold text-[#00FF00] bg-[#00FF00]/10 px-2 py-1 rounded-md">
                    Recommended
                  </span>
                )}
                {!item.recommended && (
                  <span className="text-[10px] text-gray-600">{item.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => navigate('/report')}
          className="w-full bg-[#00FF00] text-black font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
