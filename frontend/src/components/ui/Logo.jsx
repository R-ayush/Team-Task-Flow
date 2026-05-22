
export default function Logo({ className = "w-8 h-8", iconOnly = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-3 select-none group">
      <div className={`relative flex items-center justify-center shrink-0 ${className} rounded-xl bg-slate-900/60 border border-white/[0.08] shadow-lg shadow-black/20 overflow-hidden`}>
        {/* Subtle gradient hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg 
          viewBox="0 0 32 32" 
          className="w-3/5 h-3/5 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Card Outline representing a board lane/project */}
          <rect 
            x="5" 
            y="6" 
            width="10" 
            height="14" 
            rx="2.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeOpacity="0.4"
            className="transition-all duration-300 group-hover:stroke-indigo-400 group-hover:stroke-opacity-70"
          />
          {/* Front Card with Gradient Fill representing an active task */}
          <rect 
            x="13" 
            y="12" 
            width="14" 
            height="14" 
            rx="3" 
            fill="url(#logo-grad)" 
            stroke="url(#logo-grad-stroke)" 
            strokeWidth="1.5" 
          />
          {/* Checkmark inside front card representing success/flow */}
          <path 
            d="M17 19L20 22L25 16" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="logo-grad" x1="13" y1="12" x2="27" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="logo-grad-stroke" x1="13" y1="12" x2="27" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#99f6e4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {!iconOnly && (
        <span className={`text-xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent group-hover:text-white transition-all duration-300 ${textClassName}`}>
          TaskFlow
        </span>
      )}
    </div>
  )
}
