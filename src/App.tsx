import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Report from './pages/Report';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Scan from './pages/Scan';
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();
  const showBottomNav = location.pathname !== '/' && location.pathname !== '/onboarding';

  return (
    <div className="min-h-screen bg-black font-sans text-white overflow-hidden flex justify-center">
      <div className="w-full max-w-md h-[100dvh] relative bg-black shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
             {/* @ts-ignore */}
             <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/report" element={<Report />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/scan" element={<Scan />} />
            </Routes>
          </AnimatePresence>
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
