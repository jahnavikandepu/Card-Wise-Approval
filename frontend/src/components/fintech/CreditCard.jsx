import React from 'react';
import { Wifi, Sparkles } from 'lucide-react';

const CreditCard = ({
  holderName = 'CARDHOLDER NAME',
  cardNumber = '•••• •••• •••• 4821',
  validThru = '12/29',
  cardType = 'PLATINUM ELITE',
  className = '',
  compact = false
}) => {
  return (
    <div
      className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-indigo-500/20 overflow-hidden select-none bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 ${className}`}
    >
      {/* Background Decorative FinTech Geometry */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-36 h-36 border border-white/5 rounded-full pointer-events-none -mr-10 -mb-10" />
      <div className="absolute right-0 bottom-0 w-52 h-52 border border-white/5 rounded-full pointer-events-none -mr-16 -mb-16" />

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/90 flex items-center justify-center shadow-inner border border-indigo-400/30">
            <span className="font-bold text-white text-sm">CW</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none">
              Card<span className="text-indigo-400">Wise</span>
            </span>
            <span className="text-[9px] tracking-widest text-indigo-300 font-semibold uppercase">
              {cardType}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Wifi className="w-5 h-5 rotate-90 opacity-80" />
          <Sparkles className="w-4 h-4 text-indigo-300 opacity-90" />
        </div>
      </div>

      {/* EMV Chip & Holographic Accent */}
      <div className="relative z-10 my-4 sm:my-6 flex items-center gap-3">
        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/60 shadow-inner flex items-center justify-center overflow-hidden">
          <div className="w-full h-px bg-amber-600/30 my-0.5" />
          <div className="w-px h-full bg-amber-600/30 mx-0.5" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
          CARD MEMBER
        </span>
      </div>

      {/* Masked Dummy Card Number */}
      <div className="relative z-10">
        <div className="text-lg sm:text-2xl font-mono tracking-widest text-slate-100 font-medium drop-shadow-sm">
          {cardNumber}
        </div>
      </div>

      {/* Card Footer Details */}
      <div className="relative z-10 mt-4 sm:mt-5 flex items-end justify-between text-xs">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
            CARD HOLDER
          </span>
          <span className="font-semibold text-slate-200 tracking-wider text-xs sm:text-sm uppercase font-mono">
            {holderName}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
            VALID THRU
          </span>
          <span className="font-semibold text-slate-200 tracking-wider text-xs sm:text-sm font-mono">
            {validThru}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
