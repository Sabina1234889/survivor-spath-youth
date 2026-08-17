import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  showSubtitle = true,
}) => {
  const isDarkBg = variant === 'dark';

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* Official Emblem Logo SVG Container */}
      <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 shrink-0 flex items-center justify-center rounded-lg sm:rounded-2xl bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950 p-1 sm:p-2 shadow-xs group-hover:scale-105 transition-transform duration-300 border border-purple-700/50">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Rounded Shield Outer Frame */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="20"
            stroke="white"
            strokeWidth="3.5"
            fill="none"
            opacity="0.9"
          />

          {/* Arching Protective Shield Line */}
          <path
            d="M 30 80 C 26 66 26 42 32 30 L 56 18 C 58 17 60 19 58 22 C 51 26 36 34 34 50 C 33 62 34 74 38 80 Z"
            fill="white"
          />

          {/* Serene Woman Profile (Center) */}
          {/* Hair flows on left */}
          <path
            d="M 36 54 C 35 46 38 38 43 30 C 45 28 48 33 46 37 C 44 42 42 48 43 54 C 41 52 38 53 36 54 Z"
            fill="white"
          />
          <path
            d="M 38 60 C 36 66 38 73 44 78 C 47 76 45 70 43 66 C 41 62 39 61 38 60 Z"
            fill="white"
          />

          {/* Face Profile facing right with delicate features */}
          <path
            d="M 44 32 C 48 37 52 41 54 45 C 53 46 50 46 48 45.5 C 50 47 53 48 55 48 C 53 50 50 50.5 48.5 50 C 51 52.5 53 53.5 55 53.5 C 51 57 48 63 45 76 C 48 76 51 72 53 66 C 55 60 57 54 55 50 C 57 48 56 44 53 41 C 51 38 48 35 44 32 Z"
            fill="white"
          />

          {/* Gentle Closed Eye & Eyelash Curve */}
          <path
            d="M 47 43.5 Q 49 42.5 51 43.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Winding Survivor's Path Ribbon swooping up towards the dove */}
          <path
            d="M 30 87 C 45 86 56 84 64 76 C 72 68 65 60 50 69 C 58 62 74 50 69 39 C 68 44 64 52 58 57 C 50 63 38 70 30 87 Z"
            fill="white"
          />
          <path
            d="M 32 87 C 52 84 68 81 72 74 C 65 80 50 83 32 87 Z"
            fill="white"
            opacity="0.8"
          />

          {/* Soaring Dove of Peace / Freedom in Flight (Top Right) */}
          <path
            d="M 72 20 C 67 22 62 25 60 29 C 64 28 67 28 70 29 C 65 32 61 37 61 42 C 65 38 70 35 74 34 C 73 37 72 40 70 42 C 74 40 78 35 80 31 C 84 30 87 28 89 26 C 84 26 80 27 77 25 C 79 23 81 21 83 19 C 78 20 75 21 72 20 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-xs sm:text-base md:text-xl font-display whitespace-nowrap ${
              isDarkBg ? 'text-white' : 'text-purple-950'
            }`}
          >
            SURVIVOR’S PATH
          </span>
          <span className="px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-extrabold tracking-wider sm:tracking-widest uppercase rounded bg-purple-700 text-white leading-none shadow-2xs shrink-0">
            YOUTH
          </span>
        </div>
        {showSubtitle && (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[10px] sm:text-[11px] font-semibold tracking-tight ${
                isDarkBg ? 'text-purple-200/80' : 'text-purple-800/80'
              }`}
            >
              An initiative of Survivor’s Path
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

