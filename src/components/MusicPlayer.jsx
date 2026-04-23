import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, X } from 'lucide-react';

const playlist = [
  { name: 'Lofi Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Electronic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showPlayer, setShowPlayer] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    newX = Math.min(Math.max(0, newX), window.innerWidth - (containerRef.current?.offsetWidth || 300));
    newY = Math.min(Math.max(0, newY), window.innerHeight - (containerRef.current?.offsetHeight || 120));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!showPlayer) {
    return (
      <button
        onClick={() => setShowPlayer(true)}
        className="fixed bg-green-500/20 p-2 rounded-full z-50 hover:bg-green-500/30 transition cursor-move"
        style={{ left: position.x, top: position.y }}
      >
        <Music className="w-5 h-5 text-green-500" />
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed glassmorphism rounded-lg p-3 w-80 z-50 shadow-lg cursor-move bg-black/80 backdrop-blur border border-green-500/40"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-green-500 text-sm font-bold">🎧 Hacker Radio</h3>
        <button onClick={() => setShowPlayer(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-white text-xs truncate mt-1">{playlist[currentTrack].name}</p>
      <ReactPlayer
        url={playlist[currentTrack].url}
        playing={isPlaying}
        volume={volume}
        muted={true}
        width="0"
        height="0"
        onEnded={nextTrack}
      />
      <div className="flex justify-center gap-3 mt-2">
        <button onClick={prevTrack}><SkipBack className="w-5 h-5 text-green-500" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="w-5 h-5 text-green-500" /> : <Play className="w-5 h-5 text-green-500" />}
        </button>
        <button onClick={nextTrack}><SkipForward className="w-5 h-5 text-green-500" /></button>
        <div className="flex items-center gap-1">
          <Volume2 className="w-4 h-4 text-green-500" />
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-16" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;