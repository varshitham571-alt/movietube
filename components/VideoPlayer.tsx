
import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, ScanIcon, CropIcon } from './Icons';
import { detectCommercialProducts } from '../services/geminiService';
import { DetectedItem } from '../types';

interface VideoPlayerProps {
  url: string;
  onScanComplete: (items: DetectedItem[], screenshot: string) => void;
  onScanStart: () => void;
  isScanning: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onScanComplete, onScanStart, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (!isScanning) {
      handleScan();
    }
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    onScanStart();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use a high enough resolution for detail, but low enough for fast upload
    canvas.width = 1280;
    canvas.height = 720;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const screenshot = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = screenshot.split(',')[1];
      const results = await detectCommercialProducts(base64Data);
      onScanComplete(results.items, screenshot);
    } catch (err) {
      console.error("Deep Scan Error:", err);
      onScanComplete([], "");
    }
  };

  return (
    <div className="relative group bg-black rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
      <video
        ref={videoRef}
        src={url}
        crossOrigin="anonymous"
        className="w-full aspect-video transition-all duration-700"
        onTimeUpdate={handleProgress}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onClick={togglePlay}
        playsInline
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {isScanning && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-xl">
          <div className="relative">
             <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse" />
             <ScanIcon className="w-20 h-20 text-red-600 relative animate-pulse" />
          </div>
          <p className="mt-8 text-white font-black tracking-[0.5em] uppercase text-xs italic animate-pulse">Analyzing Everything...</p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all z-40">
        <div className="h-1 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={togglePlay} className="text-white hover:text-red-500 transition-transform active:scale-90">
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleScan(); }}
              className="px-6 py-2 bg-white/10 text-white hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 transition-all"
            >
              <ScanIcon className="w-4 h-4" />
              <span>Full Scan</span>
            </button>
          </div>
          
          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">
            Turbo Analysis Mode
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
