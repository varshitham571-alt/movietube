
import React, { useState, useEffect, useRef } from 'react';
import { VideoItem, DetectedItem } from './types';
import VideoPlayer from './components/VideoPlayer';
import ShoppingPanel from './components/ShoppingPanel';
import { UploadIcon, PlayIcon, ShoppingBagIcon, ScanIcon } from './components/Icons';

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'def-1',
    title: 'Modern Interior & Fashion',
    description: 'A dense scene with various furniture, lighting fixtures, and high-end fashion.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    timestamp: Date.now()
  },
  {
    id: 'def-2',
    title: 'Workspace & Tech',
    description: 'Identify laptops, peripherals, desk accessories, and minimalist office decor.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    timestamp: Date.now() - 10000
  },
  {
    id: 'def-3',
    title: 'Outdoor Adventure',
    description: 'Technical gear, watches, and specialized sports equipment.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
    timestamp: Date.now() - 20000
  }
];

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  
  const browseRef = useRef<HTMLElement>(null);

  const performRedirection = (query: string) => {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    setRedirectingTo(query);
    window.open(searchUrl, '_blank');
  };

  const scrollToBrowse = () => {
    setSelectedVideo(null);
    setTimeout(() => {
      const el = document.getElementById('browse');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = URL.createObjectURL(file);
    
    const newVideo: VideoItem = {
      id: `user-${Date.now()}`,
      title: file.name.split('.')[0],
      description: `Uploaded on ${new Date().toLocaleDateString()}. Deep Vision Enabled.`,
      videoUrl: url,
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      timestamp: Date.now()
    };
    
    setVideos(prev => [newVideo, ...prev]);
    setIsUploading(false);
    setSelectedVideo(newVideo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanStart = () => {
    setIsScanning(true);
    setDetectedItems([]);
    setCurrentScreenshot(null);
    setRedirectingTo(null);
  };

  const handleScanComplete = (items: DetectedItem[], screenshot: string) => {
    setDetectedItems(items);
    setCurrentScreenshot(screenshot);
    setIsScanning(false);
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
    v.description.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 selection:bg-red-600 selection:text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => { setSelectedVideo(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="bg-red-600 p-2.5 rounded-xl group-hover:rotate-12 transition-all">
              <PlayIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter">
              MOVIE<span className="text-red-600">TUBE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
             <button onClick={scrollToBrowse} className="hover:text-red-600 transition-colors">Library</button>
             <a href="#how-it-works" className="hover:text-red-600 transition-colors">Technology</a>
          </div>

          <div className="flex items-center space-x-4">
            <label className="bg-white text-black px-6 py-2.5 rounded-full cursor-pointer hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center space-x-3 active:scale-95">
              <UploadIcon className="w-4 h-4" />
              <span>{isUploading ? 'Saving...' : 'Upload Video'}</span>
              <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1">
        {selectedVideo ? (
          <div className="max-w-7xl mx-auto w-full p-6 lg:p-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <VideoPlayer 
                  url={selectedVideo.videoUrl} 
                  onScanStart={handleScanStart}
                  onScanComplete={handleScanComplete}
                  isScanning={isScanning}
                />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">{selectedVideo.title}</h2>
                    <p className="text-gray-500 mt-4 text-sm font-medium max-w-xl">{selectedVideo.description}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-3xl border border-white/5">
                      <div className="p-2 bg-red-600 rounded-xl"><ScanIcon className="w-5 h-5 text-white" /></div>
                      <div className="pr-4">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Scanning Engine</p>
                        <p className="text-[11px] font-bold text-gray-300">Exhaustive Mode Active</p>
                      </div>
                  </div>
                </div>

                {redirectingTo && (
                  <div className="p-8 bg-red-600/10 border border-red-600/30 rounded-[2.5rem] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Searching</p>
                      <p className="text-2xl font-black text-white italic">"{redirectingTo}"</p>
                    </div>
                    <button onClick={() => performRedirection(redirectingTo!)} className="px-8 py-4 bg-red-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest">Shop Now</button>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <ShoppingPanel 
                  items={detectedItems} 
                  screenshot={currentScreenshot} 
                  isLoading={isScanning}
                  onManualSearch={performRedirection}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-32 pb-32">
            <section className="relative pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-12">
                Universal Vision AI
              </div>
              <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                FIND <span className="text-red-600">ANYTHING.</span><br />BUY <span className="text-red-600">EVERYTHING.</span>
              </h1>
              <p className="mt-12 text-gray-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto">
                The absolute standard in video commerce. Upload, Scan, and Own any item in seconds.
              </p>
              
              <div className="mt-16 flex flex-wrap justify-center gap-6">
                <button 
                   onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
                   className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center space-x-4"
                >
                  <UploadIcon className="w-5 h-5" />
                  <span>Upload & Save</span>
                </button>
                <button 
                   onClick={scrollToBrowse}
                   className="px-12 py-5 border border-white/10 rounded-[1.5rem] font-black text-sm uppercase tracking-widest text-white hover:bg-white/5 transition-all"
                >
                  Explore Library
                </button>
              </div>
            </section>
            
            <section id="browse" className="max-w-7xl mx-auto px-6 space-y-16 pt-20">
              <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/5 pb-12">
                <div className="space-y-4">
                   <h2 className="text-5xl font-black uppercase italic tracking-tighter">VIDEO <span className="text-red-600">LIBRARY</span></h2>
                   <p className="text-gray-500 font-medium italic">Search through default and your uploaded videos.</p>
                </div>
                
                <div className="relative w-full md:w-96">
                  <input 
                    type="text"
                    placeholder="Search Library..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all shadow-2xl"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                    <ScanIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  {filteredVideos.map(video => (
                    <div key={video.id} className="group cursor-pointer" onClick={() => { setSelectedVideo(video); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      <div className="aspect-[16/10] bg-gray-900 rounded-[3rem] overflow-hidden border border-white/5 relative group-hover:border-red-600/50 transition-all duration-700 shadow-2xl group-hover:-translate-y-2">
                        <img src={video.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" alt={video.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        
                        {!video.id.startsWith('def') && (
                          <div className="absolute top-6 right-6 px-3 py-1 bg-red-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white">
                            Your Upload
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                             <PlayIcon className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 px-4">
                        <h3 className="font-black text-2xl text-gray-100 group-hover:text-red-500 transition-colors uppercase italic">{video.title}</h3>
                        <p className="text-gray-500 text-sm mt-3 line-clamp-1 font-medium italic">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-600 font-black uppercase italic tracking-widest">No results found</div>
              )}
            </section>

            <section id="how-it-works" className="max-w-7xl mx-auto px-6">
              <div className="bg-white/5 border border-white/5 rounded-[4rem] p-24 text-center">
                <h3 className="text-5xl font-black italic uppercase mb-16 tracking-tighter">HYPER-SCAN <span className="text-red-600">WORKFLOW</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">1</div>
                    <h4 className="text-2xl font-black italic">PAUSE</h4>
                    <p className="text-gray-500 text-sm">Our AI pre-analyzes every layer of the paused frame instantly.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">2</div>
                    <h4 className="text-2xl font-black italic">EXTRACT</h4>
                    <p className="text-gray-500 text-sm">The engine extracts everything from clothing to background furniture.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">3</div>
                    <h4 className="text-2xl font-black italic">SHOP</h4>
                    <p className="text-gray-500 text-sm">Direct links to global marketplaces for every identified object.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      
      <footer className="py-20 border-t border-white/5 bg-black flex flex-col items-center gap-6">
        <span className="font-black text-xl italic uppercase">MOVIE<span className="text-red-600">TUBE</span></span>
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-800 italic">© 2024 MOVIETUBE AI VISION SYSTEMS</div>
      </footer>
    </div>
  );
};

export default App;
