
import React, { useState } from 'react';
import { DetectedItem } from '../types';
import { ShoppingBagIcon, ScanIcon } from './Icons';

interface ShoppingPanelProps {
  items: DetectedItem[];
  screenshot: string | null;
  isLoading: boolean;
  onManualSearch: (query: string) => void;
}

const ShoppingPanel: React.FC<ShoppingPanelProps> = ({ items, screenshot, isLoading, onManualSearch }) => {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onManualSearch(localSearch.trim());
      setLocalSearch('');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 space-y-10 animate-pulse">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 bg-red-600/20 rounded-2xl"></div>
           <div className="h-4 w-40 bg-white/10 rounded-full"></div>
        </div>
        <div className="aspect-video bg-white/10 rounded-[2rem]"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white/10 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full max-h-[85vh]">
      <div className="p-8 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-xl tracking-tight flex items-center space-x-4 uppercase italic">
            <div className="p-2.5 bg-red-600 rounded-xl shadow-lg shadow-red-600/40 animate-pulse">
              <ScanIcon className="w-5 h-5 text-white" />
            </div>
            <span>Deep Scan Results</span>
          </h3>
          <div className="px-3 py-1 bg-red-600/20 rounded-full text-[8px] font-black uppercase tracking-widest text-red-500 border border-red-600/30">
            {items.length} Senses Active
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            placeholder="Search custom query..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-red-500 transition-colors">
             <ShoppingBagIcon className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {screenshot && (
          <div className="relative group rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src={screenshot} alt="Analyzed frame" className="w-full h-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent flex items-end p-5">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                <span className="text-[8px] font-black tracking-[0.3em] text-white uppercase">Neural Overlay Active</span>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="group p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-red-600/30 hover:bg-white/10 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-white/10 text-white/40 text-[7px] font-black uppercase tracking-widest rounded">
                      {item.category}
                    </span>
                    {item.brand && (
                      <span className="px-2 py-0.5 bg-red-600/10 text-red-400 text-[7px] font-black uppercase tracking-widest rounded border border-red-600/20">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-white/20 uppercase">Scan Confidence</span>
                    <div className="h-1 w-12 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-red-600" style={{ width: `${item.confidence * 100}%` }} />
                    </div>
                  </div>
                </div>

                <h4 className="font-black text-white uppercase tracking-tight text-sm mb-2 group-hover:text-red-500 transition-colors">
                  {item.name}
                </h4>
                
                <p className="text-[10px] text-gray-500 leading-relaxed italic mb-4 line-clamp-2">
                  {item.description}
                </p>

                {item.attributes && item.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.attributes.map((attr, aIdx) => (
                      <span key={aIdx} className="text-[8px] text-gray-600 font-bold border border-white/5 px-2 py-0.5 rounded-full lowercase">
                        #{attr.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                )}
                
                <button 
                  onClick={() => onManualSearch(item.name)}
                  className="w-full py-3.5 bg-white text-black font-black text-[9px] uppercase tracking-[0.25em] rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-black/40 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <ShoppingBagIcon className="w-3.5 h-3.5" />
                  <span>Acquire Item</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-24 px-10">
               <div className="p-8 bg-white/5 rounded-full inline-block mb-6 border border-white/5">
                 <ScanIcon className="w-12 h-12 text-gray-800" />
               </div>
               <h3 className="text-sm font-black uppercase italic tracking-widest text-gray-600 mb-2">Awaiting Visual Input</h3>
               <p className="text-[10px] text-gray-700 font-medium">Pause the stream or click 'Full Scan' to begin neural object extraction.</p>
            </div>
          )
        )}
      </div>
      
      <div className="p-6 bg-black border-t border-white/5 flex items-center justify-center space-x-3">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.5em]">Vision System Online</p>
      </div>
    </div>
  );
};

export default ShoppingPanel;
