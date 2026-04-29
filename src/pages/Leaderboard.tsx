import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Trophy, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { AwardIcon } from 'lucide-react';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Friends');
  const [myPoints, setMyPoints] = useState(1250);

  useEffect(() => {
    // Read the actual score populated from Challenges and baseline
    const currentScore = parseInt(localStorage.getItem('eco_user_points') || '1250');
    setMyPoints(currentScore);
  }, []);

  const users = [
    { rank: 1, name: 'Shanaya', leaves: 2105, img: 'https://avatar.iran.liara.run/public/girl?username=Shanaya', badge: '🥇', tag: 'Commuter', tagColor: 'text-blue-400 bg-blue-400/10' },
    { rank: 2, name: 'Vivaan', leaves: 1950, img: 'https://avatar.iran.liara.run/public/boy?username=Vivaan', badge: '🥈', tag: 'Recycler', tagColor: 'text-green-400 bg-green-400/10' },
    { rank: 3, name: 'Advik', leaves: 1820, img: 'https://avatar.iran.liara.run/public/boy?username=Advik', badge: '🥉', tag: 'Saver', tagColor: 'text-purple-400 bg-purple-400/10' },
    { rank: 11, name: 'Kiara', leaves: 1480, img: 'https://avatar.iran.liara.run/public/girl?username=Kiara' },
    { rank: 12, name: 'You', leaves: myPoints, img: 'https://avatar.iran.liara.run/public/boy?username=Reyansh', isMe: true },
  ];

  const sortedUsers = [...users].sort((a, b) => b.leaves - a.leaves);
  const myCurrentRank = sortedUsers.findIndex(u => u.isMe) + 1;

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col pt-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h1 className="text-2xl font-black tracking-tight">Leaderboard</h1>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#151F16] p-1 rounded-xl flex mx-6 mb-8 border border-white/5">
        {['Friends', 'Local Community'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
              activeTab === tab 
                ? "bg-white/10 text-white shadow-sm border border-white/5" 
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* My Rank Card */}
      <div className="bg-gradient-to-br from-[#151F16] to-[#0D140E] rounded-3xl p-5 border border-[#00FF00]/20 mx-6 mb-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.05)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/5 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-[#00FF00] p-0.5 relative">
              <img 
                src="https://avatar.iran.liara.run/public/boy?username=Reyansh" 
                alt="Me" 
                className="w-full h-full rounded-full object-cover bg-[#151F16]"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#00FF00] text-black text-[10px] font-bold px-1.5 rounded-full border-2 border-[#151F16]">
                Lvl 12
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">You</div>
              <div className="text-xs text-[#00FF00] font-medium bg-[#00FF00]/10 px-2 py-0.5 rounded-full inline-block mt-1">Top 5%</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-[#00FF00]">#{myCurrentRank}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Current Rank</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'PTS', value: myPoints.toLocaleString(), icon: Leaf },
            { label: 'STREAK', value: '12', icon: Trophy },
            { label: 'BADGES', value: '5', icon: AwardIcon },
          ].map((item, i) => (
            <div key={i} className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center flex flex-col items-center backdrop-blur-sm">
              <item.icon size={14} className="text-[#00FF00] mb-1.5" />
              <div className="text-sm font-black text-white">{item.value}</div>
              <div className="text-[9px] text-gray-500 font-bold tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-1 px-6"
      >
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">Top Ranking</h3>
        
        <div className="space-y-3">
          {sortedUsers.map((user, i) => {
            const isMe = user.isMe;
            return (
              <div 
                key={i} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl relative overflow-hidden group",
                  isMe ? "bg-[#00FF00]/10 border border-[#00FF00]/30" : "bg-[#151F16] border border-white/5"
                )}
              >
                {/* Rank Accent Bar */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  i === 0 ? "bg-yellow-400" :
                  i === 1 ? "bg-gray-400" :
                  i === 2 ? "bg-orange-400" :
                  "bg-transparent"
                )} />

                <div className="flex items-center gap-4 pl-2">
                  <div className={cn(
                    "w-6 text-center font-bold text-lg",
                    i === 0 ? "text-yellow-400" :
                    i === 1 ? "text-gray-400" :
                    i === 2 ? "text-orange-400" :
                    isMe ? "text-[#00FF00]" : "text-gray-600"
                  )}>
                    {i + 1}
                  </div>
                  <div className="relative">
                    <img 
                      src={user.img} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover bg-[#0B120C]"
                    />
                    {user.badge && (
                      <div className="absolute -bottom-1 -right-1 text-[10px] bg-[#151F16] rounded-full w-4 h-4 flex items-center justify-center border border-white/10">
                        {user.badge}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {user.name} {isMe && "(You)"}
                    </div>
                    {user.tag && (
                      <div className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-0.5 bg-white/5 text-gray-400")}>
                        {user.tag}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn("text-sm font-bold", isMe ? "text-[#00FF00]" : "text-white")}>{user.leaves.toLocaleString()}</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">PTS</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
