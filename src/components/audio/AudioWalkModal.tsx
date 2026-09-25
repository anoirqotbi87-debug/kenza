'use client';

import React from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Settings2, Repeat, Shuffle, Repeat1 } from 'lucide-react';
import { useAudioWalkPlayer, AudioWalkItem } from '../../hooks/useAudioWalkPlayer';
import { useMediaSession } from '../../hooks/useMediaSession';
import { trackEvent } from '../../utils/analytics';

interface AudioWalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: AudioWalkItem[];
  moduleName: string;
}

export default function AudioWalkModal({ isOpen, onClose, items, moduleName }: AudioWalkModalProps) {
  const {
    isPlaying,
    currentIndex,
    playbackSpeed,
    isLooping,
    repeatDarija,
    isShuffle,
    currentItem,
    togglePlay,
    play,
    pause,
    nextTrack,
    previousTrack,
    setPlaybackSpeed,
    setIsLooping,
    setRepeatDarija,
    setIsShuffle
  } = useAudioWalkPlayer(items);

  useMediaSession({
    title: currentItem?.phraseDarijaArabizi || 'Kenza Audio Walk',
    artist: `KENZA · ${moduleName}`,
    album: currentItem?.phraseSource || 'Apprendre la Darija',
    onPlay: play,
    onPause: pause,
    onPrevious: previousTrack,
    onNext: nextTrack
  });

  React.useEffect(() => {
    if (isOpen) {
      trackEvent('audio_walk_started', { moduleName, itemCount: items.length });
    }
  }, [isOpen, moduleName, items.length]);

  if (!isOpen) return null;

  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  const handleClose = () => {
    pause(); // Stop playing when closed
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          {moduleName}
        </div>
        <button 
          onClick={handleClose}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-300" />
        </button>
      </div>

      {/* Main Content (Word Display) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {currentItem ? (
          <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300" key={currentItem.id}>
            <div className="text-5xl md:text-7xl font-arabic text-amber-500 font-bold mb-4 drop-shadow-lg">
              {currentItem.phraseDarijaArabe}
            </div>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {currentItem.phraseDarijaArabizi}
            </div>
            <div className="text-xl md:text-2xl text-slate-400 mt-8 font-medium">
              {currentItem.phraseSource}
            </div>
          </div>
        ) : (
          <div className="text-2xl text-slate-500">Aucun vocabulaire disponible</div>
        )}
      </div>

      {/* Controls */}
      <div className="pb-12 px-6 max-w-xl mx-auto w-full space-y-8">
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>{currentIndex + 1}</span>
            <span>{items.length}</span>
          </div>
        </div>

        {/* Settings row */}
        <div className="flex justify-between items-center px-4">
          <button 
            onClick={() => setPlaybackSpeed(s => s === 1 ? 1.2 : s === 1.2 ? 0.8 : 1)}
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors w-12"
          >
            {playbackSpeed}x
          </button>
          
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-blue-400 bg-blue-900/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setRepeatDarija(!repeatDarija)}
            className={`p-2 rounded-full transition-colors ${repeatDarija ? 'text-blue-400 bg-blue-900/30' : 'text-slate-500 hover:text-slate-300'}`}
            title="Répéter la Darija 2x"
          >
            <Repeat1 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 rounded-full transition-colors ${isLooping ? 'text-blue-400 bg-blue-900/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex justify-center items-center gap-8">
          <button 
            onClick={previousTrack}
            className="p-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={nextTrack}
            className="p-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
