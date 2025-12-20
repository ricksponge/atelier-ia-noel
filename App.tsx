
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gift as GiftIcon, Star, Trophy, Snowflake } from 'lucide-react';
import { Gift, Particle } from './types';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7'];

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [santaX, setSantaX] = useState(-200);
  
  const gameLoopRef = useRef<number>(null);
  const santaDirection = useRef(1); // 1 = droite, -1 = gauche
  const lastSpawnTime = useRef(0);

  // Animation du Père Noël et chute des cadeaux
  const updateGame = useCallback((time: number) => {
    // 1. Déplacer le Père Noël
    setSantaX(prevX => {
      let nextX = prevX + (2.5 * santaDirection.current);
      if (nextX > window.innerWidth + 200) santaDirection.current = -1;
      if (nextX < -250) santaDirection.current = 1;
      return nextX;
    });

    // 2. Faire tomber les cadeaux
    setGifts(prevGifts => 
      prevGifts
        .map(gift => ({ ...gift, y: gift.y + gift.speed }))
        .filter(gift => gift.y < window.innerHeight + 50)
    );

    // 3. Faire apparaître un nouveau cadeau depuis la hotte
    if (time - lastSpawnTime.current > 700) {
      // Calcul de la position de la hotte selon la direction
      // La hotte est à l'arrière du traîneau
      const spawnOffset = santaDirection.current === 1 ? -40 : 140;
      
      const newGift: Gift = {
        id: Math.random(),
        x: santaX + spawnOffset,
        y: 110,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 2.5 + Math.random() * 3.5
      };
      setGifts(prev => [...prev, newGift]);
      lastSpawnTime.current = time;
    }

    gameLoopRef.current = requestAnimationFrame(updateGame);
  }, [santaX]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [updateGame]);

  const collectGift = (gift: Gift, e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(s => s + 1);
    
    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      x: gift.x,
      y: gift.y,
      color: gift.color
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setGifts(prev => prev.filter(g => g.id !== gift.id));

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-[#070b14] overflow-hidden cursor-crosshair select-none">
      {/* Ciel étoilé permanent */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Neige qui tombe */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-fall opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              top: '-20px'
            }}
          />
        ))}
      </div>

      {/* Interface Score */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-red-600/20 backdrop-blur-xl px-10 py-4 rounded-3xl border-2 border-white/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <Trophy className="text-yellow-400 drop-shadow-lg" size={40} />
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Cadeaux</span>
            <span className="text-white text-4xl font-festive font-bold leading-none">
                {score}
            </span>
          </div>
        </div>
      </div>

      {/* Le Père Noël et son Traîneau (SVG) */}
      <div 
        className="absolute top-12 z-40 drop-shadow-2xl transition-transform duration-300"
        style={{ 
            left: `${santaX}px`, 
            transform: `scaleX(${santaDirection.current}) scale(1.2)` 
        }}
      >
        <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Les Patins du Traîneau */}
          <path d="M20 85 C 20 85, 10 85, 10 75 M160 85 C 160 85, 170 85, 170 75" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
          <line x1="20" y1="85" x2="160" y2="85" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
          <line x1="40" y1="75" x2="40" y2="85" stroke="#FFD700" strokeWidth="2"/>
          <line x1="140" y1="75" x2="140" y2="85" stroke="#FFD700" strokeWidth="2"/>
          
          {/* Corps du Traîneau */}
          <path d="M30 40 L150 40 Q165 40 165 55 L165 70 Q165 80 150 80 L30 80 Q15 80 15 65 L15 55 Q15 40 30 40Z" fill="#C53030" />
          <path d="M30 40 L150 40 L150 45 L30 45 Z" fill="#FFD700" opacity="0.5"/>
          
          {/* La Hotte (Le Sac à Cadeaux) - À l'arrière */}
          <g className="animate-jiggle">
            <path d="M25 30 C 25 15, 65 15, 65 30 C 65 55, 25 55, 25 30" fill="#744210" stroke="#54310C" strokeWidth="2"/>
            <path d="M25 35 Q45 40 65 35" fill="none" stroke="#54310C" strokeWidth="1" opacity="0.5"/>
            {/* Quelques cadeaux qui dépassent de la hotte */}
            <rect x="35" y="18" width="12" height="12" fill="#48BB78" rx="1"/>
            <rect x="48" y="22" width="10" height="10" fill="#4299E1" rx="1"/>
          </g>

          {/* Le Père Noël */}
          <circle cx="110" cy="35" r="12" fill="#FED7E2" /> {/* Tête */}
          <path d="M100 35 Q110 32 120 35" stroke="#000" strokeWidth="0.5" fill="none"/> {/* Yeux */}
          <path d="M110 25 L110 15 Q110 10 120 12" stroke="#C53030" strokeWidth="8" strokeLinecap="round"/> {/* Bonnet */}
          <circle cx="122" cy="12" r="4" fill="white" /> {/* Pompon */}
          <path d="M98 42 Q110 55 122 42" fill="white" /> {/* Barbe */}
          <rect x="95" y="45" width="30" height="25" fill="#C53030" rx="5" /> {/* Manteau */}
          <rect x="95" y="58" width="30" height="4" fill="black" /> {/* Ceinture */}
          
        </svg>
      </div>

      {/* Les Cadeaux qui tombent */}
      {gifts.map(gift => (
        <button
          key={gift.id}
          onClick={(e) => collectGift(gift, e)}
          className="absolute z-30 transition-transform hover:scale-125 active:scale-150 outline-none group"
          style={{
            left: `${gift.x}px`,
            top: `${gift.y}px`,
            transform: `rotate(${gift.rotation + gift.y}deg) scale(${gift.scale})`,
          }}
        >
          <div className="relative">
            <GiftIcon 
              size={50} 
              style={{ color: gift.color }} 
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
            {/* Ruban de cadeau */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-white/30 rotate-90" />
                <div className="w-full h-1 bg-white/30" />
            </div>
          </div>
        </button>
      ))}

      {/* Particules d'éclats */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute pointer-events-none animate-ping"
          style={{ left: `${p.x}px`, top: `${p.y}px`, color: p.color }}
        >
          <Star fill="white" size={24} className="opacity-80" />
        </div>
      ))}

      {/* Sol enneigé avec relief */}
      <div className="absolute bottom-0 w-full h-40 pointer-events-none z-10">
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <style>{`
        @keyframes fall {
          from { transform: translateY(-20px) rotate(0deg); }
          to { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes jiggle {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-2px); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-jiggle {
          animation: jiggle 0.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .font-festive {
          font-family: 'Mountains of Christmas', cursive;
        }
      `}</style>
    </div>
  );
};

export default App;
