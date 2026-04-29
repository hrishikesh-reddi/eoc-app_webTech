import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="h-full w-full bg-white relative flex flex-col">
      {/* Top Half - Image Background */}
      <div className="h-[45%] w-full relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?q=80&w=2070&auto=format&fit=crop" 
          alt="Nature" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="w-16 h-16 bg-[#00FF00]/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#00FF00]/30">
            <div className="w-10 h-10 bg-[#00FF00] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.5)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">EcoTrack</h1>
          <p className="text-white/90 text-sm mt-1 font-medium drop-shadow-sm">Small steps, big impact</p>
        </div>
      </div>

      {/* Bottom Half - Login Form */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 bg-white rounded-t-[32px] -mt-8 relative z-10 px-8 pt-10 pb-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Welcome Back</h2>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50 focus:border-[#00FF00] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF00]/50 focus:border-[#00FF00] transition-all"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="text-xs font-semibold text-[#00FF00] hover:text-[#00CC00]">Forgot Password?</button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/onboarding')}
          className="w-full bg-[#00FF00] text-black font-bold text-lg py-4 rounded-2xl mt-8 shadow-[0_10px_20px_rgba(0,255,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,255,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Log In
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 font-medium">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="flex gap-4 w-full">
            <button className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/448234/apple.svg" alt="Apple" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">Apple</span>
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? <button className="text-[#00FF00] font-bold hover:underline">Sign Up</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
