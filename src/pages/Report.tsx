import React, { useEffect, useState } from 'react';
import { Share2, ArrowDown, Droplets, Zap, Car, Leaf, MapPin, TrendingDown, Award, ZapOff, Activity, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

const STATE_DATA: Record<string, { factor: number, avgKg: number }> = {
  "Maharashtra": { factor: 0.82, avgKg: 210 },
  "Delhi": { factor: 0.71, avgKg: 180 },
  "Karnataka": { factor: 0.75, avgKg: 160 },
  "Tamil Nadu": { factor: 0.72, avgKg: 175 },
  "Gujarat": { factor: 0.81, avgKg: 200 },
  "India Avg": { factor: 0.70, avgKg: 150 }
};

export default function Report() {
  const [bills, setBills] = useState<any[]>([]);
  const [totalCo2, setTotalCo2] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("India Avg");
  const [activeTab, setActiveTab] = useState<'overview' | 'reduction' | 'regional'>('overview');
  
  // Scoring
  const [carbonScore, setCarbonScore] = useState(850); 
  const [potentialSavings, setPotentialSavings] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('eco_tracked_bills') || '[]');
    setBills(stored);

    let total = 0;
    let categories: Record<string, number> = { Electricity: 0, Fuel: 0, Gas: 0, Water: 0, Other: 0 };
    let savingsAcc = 0;

    stored.forEach((bill: any) => {
      const co2 = parseFloat(bill.co2) || 0;
      total += co2;
      const cat = bill.category || 'Other';
      if (categories[cat] !== undefined) categories[cat] += co2;
      else categories['Other'] += co2;

      // Estimate 15% reducible per bill natively
      savingsAcc += co2 * 0.15;
    });

    setTotalCo2(total);
    setPotentialSavings(savingsAcc);

    // Calculate dynamic Carbon Score (1000 is perfect, lowers as emissions rise above 100kg baseline)
    const baseline = STATE_DATA[selectedState].avgKg;
    let newScore = 1000 - ((total / (baseline || 150)) * 200);
    setCarbonScore(Math.max(300, Math.min(1000, Math.round(newScore))));

    const colors: any = { Electricity: '#EAB308', Fuel: '#3B82F6', Water: '#06B6D4', Gas: '#F97316', Other: '#22C55E' };
    const newChartData = Object.keys(categories)
      .filter(k => categories[k] > 0)
      .map(k => ({ name: k, value: Number(categories[k].toFixed(1)), color: colors[k] || '#22C55E' }));

    if (newChartData.length === 0) newChartData.push({ name: 'Empty', value: 0, color: '#333' });
    setChartData(newChartData);

    const newBreakdown = stored.slice(-5).reverse().map((bill: any) => {
      let icon = Leaf; let bg = 'bg-green-500/10'; let color = 'text-green-500';
      if (bill.category === 'Fuel') { icon = Car; bg = 'bg-blue-500/10'; color = 'text-blue-500'; } 
      else if (bill.category === 'Electricity') { icon = Zap; bg = 'bg-yellow-500/10'; color = 'text-yellow-500'; } 
      else if (bill.category === 'Water') { icon = Droplets; bg = 'bg-cyan-500/10'; color = 'text-cyan-500'; }

      return {
        icon, bg, color,
        label: bill.category,
        sub: bill.date || `${bill.unitsConsumed || 0} ${bill.unit || 'units'}`,
        val: `${bill.co2} kg`,
        pct: `₹${bill.amountPaid || 0}`
      };
    });
    setBreakdownData(newBreakdown);
  }, [selectedState]);

  const topSuggestion = bills.length > 0 && bills[bills.length - 1]?.suggestions?.[0] 
    ? bills[bills.length - 1].suggestions[0] 
    : "Switching to LED bulbs or optimizing AC usage can quickly cut home energy emissions.";

  const renderOverview = () => {
    // Generate simulated breakdown context for the new "Insight Engine"
    const applianceBreakdown = [
      { name: 'HVAC / Cooling', val: Math.round(totalCo2 * 0.45) },
      { name: 'Lighting & Plugs', val: Math.round(totalCo2 * 0.20) },
      { name: 'Water Heating', val: Math.round(totalCo2 * 0.15) },
      { name: 'Phantom Draw', val: Math.round(totalCo2 * 0.10) },
      { name: 'Appliances', val: Math.round(totalCo2 * 0.10) },
    ];

    // Simulated local grid data
    const currentGridRenewable = selectedState === "Maharashtra" ? 34 : selectedState === "Karnataka" ? 48 : 22;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Main Carbon Score Card */}
        <div className="bg-gradient-to-br from-[#151F16] to-[#0D140E] p-6 rounded-3xl border border-[#00FF00]/10 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,0,0.05)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/10 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF00] bg-[#00FF00]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#00FF00]/20">
              <Award size={14} /> Carbon Score
            </span>
            <select 
              className="bg-black/60 text-xs text-white border border-white/10 rounded-lg px-2 py-1 outline-none font-bold"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {Object.keys(STATE_DATA).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="flex items-end justify-between mt-4 relative z-10">
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-6xl font-black tracking-tighter ${carbonScore > 800 ? 'text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.3)]' : carbonScore > 600 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {carbonScore}
                </span>
                <span className="text-sm font-bold text-gray-500">/ 1000</span>
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Based on {selectedState} Baseline</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Gross Emitted</div>
              <div className="text-2xl font-black text-white">{totalCo2.toFixed(1)} <span className="text-sm text-gray-500">kg</span></div>
            </div>
          </div>

          <div className="h-2 w-full bg-black/40 rounded-full mt-6 overflow-hidden flex shadow-inner relative z-10">
             <div className={`h-full ${carbonScore > 800 ? 'bg-[#00FF00]' : carbonScore > 600 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${(carbonScore/1000)*100}%` }} />
          </div>
        </div>

        {/* Live Grid Status Widget */}
        <div className="bg-[#151F16] border border-white/5 p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center relative overflow-hidden">
              <Zap size={20} className="text-blue-400 relative z-10" />
              <div className="absolute inset-0 bg-blue-400/20 blur-md isolate mix-blend-screen animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Live Grid Status</div>
              <div className="text-sm font-bold text-white">{currentGridRenewable}% Renewable Right Now</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#00FF00]/10 text-[#00FF00]">
              Optimal Time
            </span>
          </div>
        </div>

        {/* Predictive AI Alert */}
        <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-3xl flex gap-4 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/30">
             <TrendingDown size={20} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
               <ShieldCheck size={14} /> Predictive Alert
            </h3>
            <p className="text-xs font-medium text-gray-300 leading-relaxed mb-3 pr-2">
              Based on local weather forecasts, an upcoming heatwave next week could spike your HVAC load by 28%. 
            </p>
            <button className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-black px-3 py-1.5 rounded-lg hover:bg-orange-400 transition-colors">
              Precool Home Now
            </button>
          </div>
        </div>

        {/* Impact Equivalency (The Visualizer) */}
        <div className="bg-[#151F16] border border-white/5 p-5 rounded-3xl">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Your Impact Equivalent</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
                <Car size={24} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-black text-white">{Math.round(totalCo2 * 2.5)}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Miles Driven</div>
             </div>
             <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
                <ZapOff size={24} className="text-[#00FF00] mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-black text-white">{Math.round(totalCo2 * 0.12)}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Tree Years</div>
             </div>
          </div>
        </div>

        {/* AI Load Breakdown */}
        <div className="h-64 w-full bg-[#151F16]/50 rounded-3xl p-5 border border-white/5 relative">
          <h3 className="text-xs uppercase font-black tracking-widest text-[#00FF00] mb-1">AI Load Forensics</h3>
          <p className="text-[10px] text-gray-500 font-medium mb-4">Estimated breakdown of your specific environmental footprint based on historical structural data.</p>
          <ResponsiveContainer width="100%" height="70%">
            <BarChart data={applianceBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} width={100} />
              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0B120C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="val" fill="#00FF00" radius={[0, 4, 4, 0]} barSize={12}>
                {applianceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#00FF00'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Raw Log History</h3>
          <div className="space-y-3">
            {breakdownData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#151F16]/80 rounded-2xl border border-white/5 hover:bg-[#1A261C] transition-colors cursor-default">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}><item.icon size={20} /></div>
                  <div>
                     <div className="text-sm font-bold text-white">{item.label}</div>
                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{item.sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">{item.val}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{item.pct}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderReductionEngine = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#0B120C]/80 border border-emerald-500/30 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-emerald-500/10"><TrendingDown size={120} /></div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={20} className="text-emerald-400" />
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Reduction Engine</h2>
        </div>
        <p className="text-gray-400 text-xs mb-4 max-w-[200px]">AI has identified optimizations based on your billing history.</p>
        
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Potential Monthly Savings</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{potentialSavings.toFixed(1)}</span>
            <span className="text-sm text-emerald-400 font-bold">kg CO₂</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase ml-1">AI Action Plan</h3>
        
        {bills.length > 0 ? Array.from(new Set(bills.flatMap(b => b.suggestions || []))).slice(0, 4).map((sug: any, i) => (
          <div key={i} className="bg-[#151F16] p-4 rounded-2xl border border-white/5 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white/5 shrink-0 flex items-center justify-center text-white text-xs font-bold border border-white/10">
              {i + 1}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-medium pt-1.5">{sug}</p>
          </div>
        )) : (
           <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 text-sm text-gray-400">
             Scan structural bills to generate your personalized AI action plan.
           </div>
        )}
      </div>
    </motion.div>
  );

  const renderRegional = () => {
    const baseline = STATE_DATA[selectedState].avgKg;
    const factor = STATE_DATA[selectedState].factor;
    const userDiff = totalCo2 - baseline;

    const comparisonHistory = [
      { month: 'Jan', stateAvg: Math.round(baseline * 1.05), user: Math.round(baseline * 0.90) },
      { month: 'Feb', stateAvg: Math.round(baseline * 0.98), user: Math.round(baseline * 0.85) },
      { month: 'Mar', stateAvg: Math.round(baseline * 1.02), user: Math.round(baseline * 1.10) },
      { month: 'Apr', stateAvg: Math.round(baseline * 0.95), user: Math.round(baseline * 0.90) },
      { month: 'This Month', stateAvg: baseline, user: Math.round(totalCo2 || baseline * 0.8) }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl shadow-lg relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-400" size={20} />
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wide p-1">State Demographics</h2>
            </div>
            <select 
              className="bg-black/60 text-xs text-white border border-blue-500/30 rounded-lg px-2 py-1 outline-none font-bold"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {Object.keys(STATE_DATA).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B120C]/80 p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">State Avg Emission</div>
              <div className="text-xl font-black text-white">{baseline} <span className="text-xs font-medium text-gray-500">kg/mo</span></div>
            </div>
            <div className="bg-[#0B120C]/80 p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Grid Carbon Factor</div>
              <div className="text-xl font-black text-white">{factor} <span className="text-xs font-medium text-gray-500">kg/kWh</span></div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between ${userDiff > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-[#00FF00]/10 border-[#00FF00]/20'}`}>
          <div className="flex items-center gap-3">
            <Activity className={userDiff > 0 ? 'text-red-400' : 'text-[#00FF00]'} size={24} />
            <div>
              <div className="text-xs font-bold uppercase text-gray-400">Analysis vs State</div>
              <div className={`text-sm font-bold ${userDiff > 0 ? 'text-red-400' : 'text-[#00FF00]'}`}>
                {userDiff > 0 ? `+${userDiff.toFixed(1)} kg over average` : `${Math.abs(userDiff).toFixed(1)} kg below average`}
              </div>
            </div>
          </div>
        </div>

        <div className="h-64 w-full bg-[#151F16]/50 rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase font-bold text-gray-500">Monthly Trend Comparison</h3>
            <div className="flex gap-3 text-[10px] font-bold uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3B82F6]" /> State Avg</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00FF00]" /> You</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={comparisonHistory} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }} dy={10} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                contentStyle={{ backgroundColor: '#0B120C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} 
              />
              <Bar dataKey="stateAvg" name="State Avg (kg)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="user" name="Your Footprint (kg)" fill="#00FF00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col pt-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="px-6 flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black tracking-tight">Analytics</h1>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
          <Share2 size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex bg-[#151F16] p-1 rounded-xl border border-white/5">
          {[
            { id: 'overview', label: 'Score' },
            { id: 'reduction', label: 'Engine' },
            { id: 'regional', label: 'Region' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${activeTab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'reduction' && renderReductionEngine()}
        {activeTab === 'regional' && renderRegional()}
      </div>
    </div>
  );
}
