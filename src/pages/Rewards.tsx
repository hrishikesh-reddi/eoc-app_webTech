import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Leaf, ArrowUpRight, ShoppingBag, Gift, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export default function Rewards() {
  const [myPoints, setMyPoints] = useState(1250);

  useEffect(() => {
    const currentScore = parseInt(localStorage.getItem('eco_user_points') || '1250');
    setMyPoints(currentScore);
  }, []);

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col pt-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h1 className="text-2xl font-black tracking-tight">Eco Rewards</h1>
        <button className="text-xs font-bold text-[#00FF00] bg-[#00FF00]/10 px-3 py-1.5 rounded-full border border-[#00FF00]/20 flex items-center gap-1 hover:bg-[#00FF00]/20 transition-colors">
          History <History size={12} />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 px-6"
      >
        {/* Stats Row */}
        <div className="flex gap-4">
          <div className="flex-1 bg-[#151F16] p-4 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl font-black text-white">{myPoints.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
              <Leaf size={12} className="text-[#00FF00]" /> PTS Available
            </div>
          </div>
          <div className="flex-1 bg-[#151F16] p-4 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl font-black text-white">42<span className="text-sm text-gray-500 font-bold ml-1">kg</span></div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Offsets</div>
          </div>
        </div>

        {/* Milestone Card */}
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.1)] group cursor-pointer border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?q=80&w=2070&auto=format&fit=crop" 
            alt="Forest" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B120C] via-[#0B120C]/40 to-transparent" />
          
          <div className="absolute top-4 left-4 bg-[#00FF00] text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            Milestone Unlocked
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-black tracking-tight mb-1">2 Trees Planted!</h3>
            <p className="text-xs text-gray-300 font-medium mb-4 line-clamp-2">
              Your points have directly funded the planting of trees in the Amazon rainforest.
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.8)]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00FF00]">Next: 5 Trees</span>
            </div>
          </div>
        </div>

        {/* Redeem Section */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Redeem Rewards</h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Donations', 'Marketplace', 'Coupons'].map((tab, i) => (
              <button 
                key={tab}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  i === 0 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {[
              { 
                icon: ShoppingBag, 
                title: 'Bamboo Essentials Kit', 
                desc: 'Sustainable bamboo toothbrush with charcoal bristles.', 
                cost: 450, 
                tag: 'Product',
                img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?q=80&w=2070&auto=format&fit=crop'
              },
              { 
                icon: Leaf, 
                title: 'Plant a Real Tree', 
                desc: 'Instantly convert points to plant a new physical tree.', 
                cost: 800, 
                tag: 'Offset',
                img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?q=80&w=2070&auto=format&fit=crop'
              },
              { 
                icon: Ticket, 
                title: 'EcoMarket 20% OFF', 
                desc: 'Direct discount on sustainable marketplace goods.', 
                cost: 300, 
                tag: 'Perk',
                discount: '20% OFF'
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#151F16] p-3 rounded-3xl border border-white/5 flex gap-4 hover:bg-[#1A261C] transition-colors group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-white/5 shrink-0 overflow-hidden relative">
                  {item.img ? (
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#00FF00]/10 text-[#00FF00] font-black tracking-tight text-xs">
                      {item.discount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-lg font-bold uppercase ${
                      item.tag === 'Product' ? 'bg-blue-500/10 text-blue-400' :
                      item.tag === 'Offset' ? 'bg-[#00FF00]/10 text-[#00FF00]' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>{item.tag}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium line-clamp-2 mb-2 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">
                      <Leaf size={10} fill="currentColor" /> {item.cost} PTS
                    </div>
                    <button className="text-[10px] font-bold bg-white text-black px-4 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
