import React from "react";
import { Coins, PhoneCall, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onAdminClick: () => void;
  onScrollToRegister: () => void;
  isAdminMode?: boolean;
}

export default function Navbar({ onAdminClick, onScrollToRegister, isAdminMode = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bradesco Inspired Icon / Logo Shape */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brad-red text-white shadow-md transition-transform hover:scale-105">
            <span className="font-display text-xl font-extrabold tracking-tighter">b</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-livelo-pink animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-brad-dark sm:text-lg">
              Resgate <span className="text-brad-red">Bradesco</span>
            </span>
            <span className="font-mono text-[9px] font-medium tracking-wider uppercase text-slate-400">
              Pontos Livelo
            </span>
          </div>
        </div>

        {/* Navigation Elements */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdminMode && (
            <button
              onClick={onAdminClick}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              Painel Admin
            </button>
          )}

          <a
            href="https://wa.me/5573998630223"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors sm:flex"
          >
            <PhoneCall className="h-3.5 w-3.5 text-green-600" />
            (73) 99863-0223
          </a>

          <button
            onClick={onScrollToRegister}
            className="flex items-center gap-1.5 rounded-lg bg-brad-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brad-red-dark hover:shadow transition-all sm:px-4 sm:py-2"
          >
            <ShieldCheck className="hidden h-4 w-4 sm:block" />
            Iniciar Cadastro
          </button>
        </div>
      </div>
    </header>
  );
}
