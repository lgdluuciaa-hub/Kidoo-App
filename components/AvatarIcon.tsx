
import React from 'react';

export type AvatarId = 'tiger' | 'panda' | 'koala' | 'fox';

interface AvatarIconProps {
  id: AvatarId | string;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ id, className = "w-full h-full" }) => {
  switch (id) {
    case 'tiger':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#fb923c" />
          <circle cx="30" cy="40" r="5" fill="black" />
          <circle cx="70" cy="40" r="5" fill="black" />
          <path d="M40 60 Q50 70 60 60" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M15 50 L30 50 M70 50 L85 50" stroke="black" strokeWidth="3" />
          <path d="M50 10 L50 25 M30 15 L35 25 M70 15 L65 25" stroke="black" strokeWidth="4" />
        </svg>
      );
    case 'panda':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="45" fill="#f1f5f9" />
          <circle cx="30" cy="25" r="12" fill="#334155" />
          <circle cx="70" cy="25" r="12" fill="#334155" />
          <ellipse cx="32" cy="45" rx="8" ry="10" fill="#334155" />
          <ellipse cx="68" cy="45" rx="8" ry="10" fill="#334155" />
          <circle cx="32" cy="43" r="3" fill="white" />
          <circle cx="68" cy="43" r="3" fill="white" />
          <path d="M45 65 Q50 70 55 65" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'koala':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="20" cy="35" r="15" fill="#94a3b8" />
          <circle cx="80" cy="35" r="15" fill="#94a3b8" />
          <circle cx="20" cy="35" r="8" fill="#e2e8f0" />
          <circle cx="80" cy="35" r="8" fill="#e2e8f0" />
          <circle cx="50" cy="55" r="40" fill="#94a3b8" />
          <circle cx="35" cy="50" r="4" fill="#1e293b" />
          <circle cx="65" cy="50" r="4" fill="#1e293b" />
          <rect x="44" y="55" width="12" height="18" rx="6" fill="#1e293b" />
        </svg>
      );
    case 'fox':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 15 L15 65 L85 65 Z" fill="#f59e0b" />
          <path d="M50 15 L15 65 L50 65 Z" fill="#fbbf24" />
          <path d="M15 65 Q50 85 85 65" fill="#fff" />
          <circle cx="38" cy="55" r="4" fill="#451a03" />
          <circle cx="62" cy="55" r="4" fill="#451a03" />
          <circle cx="50" cy="72" r="5" fill="#451a03" />
          <path d="M15 65 L5 40 L30 55 Z" fill="#f59e0b" />
          <path d="M85 65 L95 40 L70 55 Z" fill="#f59e0b" />
        </svg>
      );
    default:
      return <span className="text-4xl">{id}</span>;
  }
};
