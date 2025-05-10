import React, { useEffect, useState } from 'react';

const colors = ['#6366f1', '#a21caf', '#f59e42', '#10b981', '#f43f5e', '#fbbf24', '#3b82f6', '#eab308'];

const Confetti = () => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    setPieces(Array.from({ length: 40 }, (_, i) => ({
      left: Math.random() * 100, // percent
      delay: Math.random() * 1.5, // seconds
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
      size: 8 + Math.random() * 8,
      duration: 1.8 + Math.random() * 1.2,
      key: i,
    })));
  }, []);

  return (
    <div style={{
      pointerEvents: 'none',
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 50,
      overflow: 'hidden'
    }}>
      {pieces.map(piece => (
        <div
          key={piece.key}
          style={{
            position: 'absolute',
            left: `${piece.left}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size * 2,
            background: piece.color,
            borderRadius: '2px',
            transform: `rotate(${piece.rotate}deg)`,
            opacity: 0.85,
            animation: `confetti-fall ${piece.duration}s cubic-bezier(.62,.09,.36,1) ${piece.delay}s forwards`
          }}
        />
      ))}
      <style>
        {`
        @keyframes confetti-fall {
          0% { opacity: 0.85; transform: translateY(0) scale(1) rotate(var(--rotate, 0deg)); }
          80% { opacity: 0.85; }
          100% { opacity: 0; transform: translateY(90vh) scale(0.8) rotate(var(--rotate, 0deg)); }
        }
        `}
      </style>
    </div>
  );
};

export default Confetti; 