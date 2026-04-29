import React from 'react';
import { ArrowLeft, Save, Award, Download, Trash2, Bell, MapPin, Car, ChevronRight, LogOut, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Profile() {
  const [autoTrack, setAutoTrack] = React.useState(true);
  const [gps, setGps] = React.useState(false);
  const [billScan, setBillScan] = React.useState(true);
  const [weeklySummary, setWeeklySummary] = React.useState(false);

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "w-10 h-5 rounded-full relative transition-colors duration-300",
        checked ? "bg-[#00FF00]" : "bg-gray-600"
      )}
    >
      <div className={cn(
        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
        checked ? "left-6" : "left-1"
      )} />
    </button>
  );

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col px-6 py-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Profile & Settings</h1>
        <button className="text-sm font-medium text-[#00FF00]">Save</button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-[#151F16] border-2 border-[#00FF00] p-1 mb-4 relative">
          <img 
            src="https://avatar.iran.liara.run/public/boy?username=Reyansh" 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-[#00FF00] p-1.5 rounded-full border-2 border-[#0B120C]">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
        <h2 className="text-xl font-bold">Reyansh</h2>
        <div className="flex items-center gap-2 text-xs text-[#00FF00] mt-1 bg-[#00FF00]/10 px-3 py-1 rounded-full">
          <Award size={12} /> Eco-Warrior • Level 12
        </div>
        <p className="text-xs text-gray-500 mt-2">Member since 2023</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'BADGES', value: '15', icon: Award },
          { label: 'SAVED', value: '120kg', icon: Leaf },
          { label: 'DAYS', value: '45', icon: CalendarIcon },
        ].map((item, i) => (
          <div key={i} className="bg-[#151F16] p-4 rounded-2xl border border-white/5 text-center flex flex-col items-center shadow-sm">
            <item.icon size={20} className="text-[#00FF00] mb-2" />
            <div className="text-xl font-bold text-white">{item.value}</div>
            <div className="text-[10px] text-gray-500 font-bold mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Tracking Preferences */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Tracking Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-blue-500">
                  <Car size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Auto-Track Transport</div>
                  <div className="text-[11px] text-gray-500">Detect trips automatically</div>
                </div>
              </div>
              <Toggle checked={autoTrack} onChange={setAutoTrack} />
            </div>

            <div className="flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-[#00FF00]">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">High Accuracy GPS</div>
                  <div className="text-[11px] text-gray-500">Improve footprint calculation</div>
                </div>
              </div>
              <Toggle checked={gps} onChange={setGps} />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-orange-500">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Bill Scan Reminders</div>
                  <div className="text-[11px] text-gray-500">Monthly utility alerts</div>
                </div>
              </div>
              <Toggle checked={billScan} onChange={setBillScan} />
            </div>

            <div className="flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-purple-500">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Weekly Summary</div>
                  <div className="text-[11px] text-gray-500">Push notification report</div>
                </div>
              </div>
              <Toggle checked={weeklySummary} onChange={setWeeklySummary} />
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Data Management</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5 hover:bg-[#1A261C] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-[#00FF00]">
                  <Download size={20} />
                </div>
                <div className="text-sm font-bold text-white">Export Data (CSV/PDF)</div>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </button>

            <button className="w-full flex items-center justify-between bg-[#151F16] p-3.5 rounded-2xl border border-white/5 hover:bg-[#1A261C] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A261C] flex items-center justify-center text-gray-400">
                  <Trash2 size={20} />
                </div>
                <div className="text-sm font-bold text-white">Clear Cache</div>
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </section>

        <button className="w-full border border-red-500/30 text-red-500 font-bold text-sm py-4 flex items-center justify-center gap-2 hover:bg-red-500/10 rounded-2xl transition-colors mt-4">
          Log Out
        </button>

        <div className="text-center text-[10px] text-gray-600 pb-4">
          Version 2.4.0 (Build 302)
        </div>
      </div>
    </div>
  );
}

function CalendarIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
