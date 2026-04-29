import React, { useState, useRef } from 'react';
import { ArrowLeft, ScanLine, Image as ImageIcon, Upload, Loader2, CheckCircle, XCircle, Leaf, Zap, Droplets, Car, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Scan() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentBills, setRecentBills] = useState<any[]>([]);

  React.useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('eco_tracked_bills') || '[]');
    // Keep a list of the 5 most recently scanned bills (reverse order)
    setRecentBills(existing.reverse().slice(0, 5));
  }, [scanResult]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setScanResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        
        let mimeType = file.type || 'application/octet-stream';
        const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
        let base64Data = dataUrl;
        
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        } else {
          base64Data = dataUrl.split(',')[1] || dataUrl;
        }
        
        try {
          const response = await fetch('/api/scan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileData: base64Data, mimeType }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to analyze document');
          }

          const data = await response.json();
          setScanResult(data);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to analyze document. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError('Error reading file');
      setIsAnalyzing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Electricity': return <Zap className="text-yellow-400" size={20} />;
      case 'Fuel': return <Car className="text-blue-400" size={20} />;
      case 'Water': return <Droplets className="text-cyan-400" size={20} />;
      default: return <Leaf className="text-[#00FF00]" size={20} />;
    }
  };

  return (
    <div className="h-full w-full bg-[#0B120C] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 p-2 bg-white/5 rounded-full hover:bg-white/10 z-20"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611273426761-53c8577a20fa?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 select-none pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B120C]/80 via-[#0B120C]/90 to-[#0B120C] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 w-full px-6 max-w-md h-full justify-center">
        
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#151F16]/95 backdrop-blur-xl p-8 rounded-[32px] border border-[#00FF00]/30 flex flex-col items-center text-center w-full shadow-2xl"
            >
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-[#00FF00]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#00FF00] rounded-full border-t-transparent animate-spin" />
                <ScanLine size={32} className="text-[#00FF00]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Analyzing Bill...</h3>
              <p className="text-gray-400 text-sm">Extracting consumption data, checking regional emission factors, and calculating footprint.</p>
            </motion.div>
          ) : scanResult ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151F16]/95 backdrop-blur-xl p-6 rounded-[32px] border border-[#00FF00]/30 w-full max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl pb-8"
            >
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#151F16]/90 py-2 z-10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {scanResult.isValid ? (
                    <CheckCircle className="text-[#00FF00]" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  Impact Report
                </h3>
                <button 
                  onClick={() => setScanResult(null)}
                  className="bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>

              {scanResult.isValid ? (
                <div className="space-y-5">
                  
                  {/* Hero Stat */}
                  <div className="flex items-center justify-between bg-gradient-to-br from-[#0B120C] to-[#111A12] p-5 rounded-3xl border border-white/5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
                        {getCategoryIcon(scanResult.category)} {scanResult.category} • {scanResult.date}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-white">{scanResult.co2}</span>
                        <span className="text-sm font-bold text-[#00FF00]">kg CO₂</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Spent</div>
                      <div className="text-xl font-bold text-white">₹{scanResult.amountPaid}</div>
                    </div>
                  </div>

                  {/* Benchmark Alert */}
                  {scanResult.benchmark && (
                    <div className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border bg-opacity-10",
                      scanResult.co2 > 100 ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-[#00FF00]/10 border-[#00FF00]/20 text-[#00FF00]"
                    )}>
                      {scanResult.co2 > 100 ? <AlertTriangle size={20} className="shrink-0 mt-0.5" /> : <TrendingUp size={20} className="shrink-0 mt-0.5" />}
                      <p className="text-xs font-medium leading-relaxed">
                        {scanResult.benchmark}
                      </p>
                    </div>
                  )}
                  
                  {/* Data Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0B120C]/60 p-4 rounded-2xl border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Consumption</div>
                      <div className="font-bold text-lg">{scanResult.unitsConsumed} <span className="text-xs text-gray-400">{scanResult.unit}</span></div>
                    </div>
                    <div className="bg-[#0B120C]/60 p-4 rounded-2xl border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Carbon Cost</div>
                      <div className="font-bold text-lg">₹{scanResult.costPerKg} <span className="text-xs text-gray-400">/ kg</span></div>
                    </div>
                  </div>

                  {/* Equivalency */}
                  {scanResult.treesEquivalent && (
                    <div className="bg-[#0B120C]/60 p-4 rounded-2xl border border-[#00FF00]/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00] text-xl">
                        🌳
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium">Environmental Impact</div>
                        <div className="text-sm font-bold">Takes <span className="text-[#00FF00]">{scanResult.treesEquivalent} trees</span> a full year to absorb this.</div>
                      </div>
                    </div>
                  )}

                  {/* AI Deep Audit Forensics */}
                  {scanResult.forensics && scanResult.forensics.length > 0 && (
                    <div className="pt-2">
                       <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <ScanLine size={16} className="text-[#00FF00]" /> AI Deep Audit
                      </h4>
                      <div className="space-y-3">
                        {scanResult.forensics.map((f: any, idx: number) => {
                          const isNegative = f.type === 'tariff_penalty' || f.type === 'hidden_leak' || f.type === 'anomaly';
                          return (
                            <div key={idx} className={`flex items-start gap-3 p-4 rounded-2xl border ${isNegative ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-[#00FF00]/10 border-[#00FF00]/20'}`}>
                              <div className={`shrink-0 mt-0.5 ${isNegative ? 'text-indigo-400' : 'text-[#00FF00]'}`}>
                                {isNegative ? <AlertTriangle size={18} /> : <TrendingUp size={18} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className={`text-xs font-bold uppercase tracking-wider ${isNegative ? 'text-indigo-400' : 'text-[#00FF00]'}`}>{f.title}</h5>
                                  {f.financialImpact > 0 && (
                                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                                      Recoverable: ₹{f.financialImpact}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">{f.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Smart Insights */}
                  {scanResult.suggestions && scanResult.suggestions.length > 0 && !scanResult.forensics && (
                    <div className="pt-2">
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Lightbulb size={16} className="text-yellow-400" /> Smart Action Plan
                      </h4>
                      <div className="space-y-2">
                        {scanResult.suggestions.map((sug: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 bg-[#0B120C]/40 p-3.5 rounded-2xl border border-white/5">
                            <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 text-xs shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{sug}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      if (!scanResult.timestamp) {
                        const existing = JSON.parse(localStorage.getItem('eco_tracked_bills') || '[]');
                        existing.push({ ...scanResult, timestamp: Date.now() });
                        localStorage.setItem('eco_tracked_bills', JSON.stringify(existing));
                      }
                      navigate('/report');
                    }}
                    className="w-full bg-[#00FF00] text-black font-black text-sm py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,255,0,0.2)] mt-4"
                  >
                    {scanResult.timestamp ? 'Go to Dashboard' : 'Add to Dashboard'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Unrecognized Document</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">Could not identify electricity, fuel, water, or gas details. Please ensure the bill is clear and amounts/units are visible.</p>
                  <button 
                    onClick={() => setScanResult(null)}
                    className="bg-white/10 text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/20 transition-colors"
                  >
                    Try Another Photo
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="w-56 h-56 border border-[#00FF00]/50 rounded-[40px] relative flex items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,0,0.1)]">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00FF00] -mt-1 -ml-1 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00FF00] -mt-1 -mr-1 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00FF00] -mb-1 -ml-1 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00FF00] -mb-1 -mr-1 rounded-br-2xl" />
                
                <div className="flex flex-col items-center gap-4">
                  <ScanLine className="text-[#00FF00] animate-pulse" size={56} strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00FF00]/0 via-[#00FF00]/10 to-[#00FF00]/0 h-2 w-full animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black mb-2 tracking-tight">Track Your Impact</h2>
                <p className="text-gray-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                  Scan electricity bills, fuel receipts, or gas invoices to calculate instant CO₂ insights.
                </p>
              </div>

              <div className="flex flex-col items-center gap-5 w-full bg-[#151F16]/50 backdrop-blur-lg p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center justify-center gap-8 w-full">
                  {/* Gallery Upload */}
                  <label className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <ImageIcon size={22} className="text-gray-300" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Gallery</span>
                  </label>

                  {/* Shutter Button */}
                  <button className="w-20 h-20 bg-[#00FF00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,0,0.3)] hover:scale-105 transition-transform active:scale-95 border-4 border-[#0B120C]">
                    <div className="w-[60px] h-[60px] border-[3px] border-[#0B120C] rounded-full flex items-center justify-center overflow-hidden relative">
                       <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    </div>
                  </button>

                  {/* File Upload */}
                  <label className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <Upload size={22} className="text-gray-300" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Files</span>
                  </label>
                </div>
              </div>

              {/* Recent Scans List */}
              {recentBills.length > 0 && (
                <div className="w-full bg-[#151F16]/50 backdrop-blur-lg p-5 rounded-3xl border border-white/5 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Recently Scanned</h3>
                  <div className="space-y-3">
                    {recentBills.map((bill, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between bg-black/40 p-3.5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.98]" 
                        onClick={() => setScanResult(bill)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-center">
                            {getCategoryIcon(bill.category)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white capitalize">
                              {bill.category} 
                              {bill.timestamp && <span className="text-[10px] text-gray-500 font-medium ml-1.5">{new Date(bill.timestamp).toLocaleDateString()}</span>}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-[130px]">{bill.date || `${bill.unitsConsumed} ${bill.unit}`}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{parseFloat(bill.co2).toFixed(1)} <span className="text-[10px] text-gray-500">kg</span></div>
                          <div className="text-[10px] text-[#00FF00] font-bold">₹{bill.amountPaid}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 bg-red-500/90 backdrop-blur-md border border-red-400 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 flex items-center gap-2"
          >
            <AlertTriangle size={18} /> {error}
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
