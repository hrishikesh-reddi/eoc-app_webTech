import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Scan, Target, Users, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dash', path: '/report' },
    { icon: Target, label: 'Quests', path: '/challenges' },
    { icon: Scan, label: 'Scan', path: '/scan', isCenter: true },
    { icon: Users, label: 'Rank', path: '/leaderboard' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
  ];

  return (
    <div className="bg-[#0B120C]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 pb-8 flex justify-between items-center fixed bottom-0 w-full max-w-md z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isCenter) {
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="relative -top-6 bg-[#00FF00] text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:scale-105 transition-transform"
            >
              <item.icon size={24} strokeWidth={2.5} />
            </button>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-colors",
              isActive ? "text-[#00FF00]" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
