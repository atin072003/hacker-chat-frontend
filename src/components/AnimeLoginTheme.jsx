import React, { useEffect, useState } from 'react';

const themes = [
  {
    name: 'One Piece',
    bg: 'linear-gradient(135deg, #0a0f1a 0%, #1a2a3a 100%)',
    accent: '#ffd700',
    glitch: false,
    animation: 'float',
    elements: ['🏴‍☠️', '⚓', '🍖', '👒']
  },
  {
    name: 'Dragon Ball',
    bg: 'linear-gradient(135deg, #ff6600, #ffcc00)',
    accent: '#ff3300',
    glitch: false,
    animation: 'pulse',
    elements: ['🐉', '⚡', '🌟', '🥋']
  },
  {
    name: 'Naruto',
    bg: 'linear-gradient(135deg, #ff9900, #cc5500)',
    accent: '#ff5500',
    glitch: false,
    animation: 'spin',
    elements: ['🍥', '⚡', '🦊', '🗡️']
  },
  {
    name: 'Attack on Titan',
    bg: 'linear-gradient(135deg, #2c3e50, #1a1a2e)',
    accent: '#e74c3c',
    glitch: true,
    animation: 'shake',
    elements: ['⚔️', '🛡️', '🏰', '🔥']
  },
  {
    name: 'Cyberpunk Edgerunners',
    bg: 'linear-gradient(135deg, #ff00cc, #3333ff)',
    accent: '#00ffff',
    glitch: true,
    animation: 'matrix',
    elements: ['💀', '🔫', '🤖', '💊']
  }
];

const AnimeLoginTheme = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Random theme on each visit (or reload)
    const random = themes[Math.floor(Math.random() * themes.length)];
    setTheme(random);
    // Apply custom styles to body
    document.body.style.background = random.bg;
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (!theme) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: theme.bg }}>
      {/* Floating anime elements */}
      <div className="absolute inset-0 pointer-events-none">
        {theme.elements.map((el, i) => (
          <div
            key={i}
            className={`absolute text-3xl opacity-20 animate-${theme.animation}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {el}
          </div>
        ))}
      </div>
      {/* Glitch effect overlay if theme has glitch */}
      {theme.glitch && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white opacity-5 animate-pulse"></div>
          <div className="absolute inset-0 bg-black opacity-10 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimeLoginTheme;