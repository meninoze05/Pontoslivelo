import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calculator, ArrowRight, Coins, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

interface HeroProps {
  onPointsSelected: (points: number) => void;
  onScrollToRegister: () => void;
}

export default function Hero({ onPointsSelected, onScrollToRegister }: HeroProps) {
  const [pointsInput, setPointsInput] = useState<string>("50.000");
  const [payoutSpeed, setPayoutSpeed] = useState<"standard" | "fast">("fast");
  const [estimatedValue, setEstimatedValue] = useState<number>(0);

  // Parse points value safely
  const getPointsNumeric = (val: string): number => {
    const clean = val.replace(/\D/g, "");
    return clean ? parseInt(clean, 10) : 0;
  };

  // Format value to currency
  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  // Format points with thousand dots
  const formatPointsString = (num: number): string => {
    if (isNaN(num)) return "";
    return num.toLocaleString("pt-BR");
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numeric = getPointsNumeric(rawVal);
    if (numeric > 1000000) return; // limit to 1 million for demo sanity
    setPointsInput(formatPointsString(numeric));
  };

  useEffect(() => {
    const points = getPointsNumeric(pointsInput);
    // Rate per 1000 points: standard is R$ 18.50, fast is R$ 17.80
    const ratePerThousand = payoutSpeed === "standard" ? 18.80 : 18.20;
    const total = (points / 1000) * ratePerThousand;
    setEstimatedValue(total);
  }, [pointsInput, payoutSpeed]);

  // Read points query parameter on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ptsParam = params.get("points");
      if (ptsParam) {
        const numeric = parseInt(ptsParam, 10);
        if (!isNaN(numeric) && numeric > 0 && numeric <= 1000000) {
          setPointsInput(formatPointsString(numeric));
          onPointsSelected(numeric);
        }
      }
    } catch (e) {
      console.error("Erro ao ler parâmetro de pontos", e);
    }
  }, []);

  const handleStartRedemption = () => {
    const points = getPointsNumeric(pointsInput);
    onPointsSelected(points);
    onScrollToRegister();
  };

  const handlePresetClick = (val: number) => {
    setPointsInput(formatPointsString(val));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brad-dark-blue to-slate-950 pt-16 pb-24 text-white">
      {/* Absolute decorative gradient backgrounds */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-brad-red/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-livelo-pink/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Hero Left Content */}
          <div className="flex flex-col space-y-6 lg:col-span-7">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-livelo-pink animate-pulse" />
              <span className="text-slate-300">EXCLUSIVO PARA CLIENTES BRADESCO</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              Troque seus pontos <span className="bg-gradient-to-r from-livelo-pink to-red-500 bg-clip-text text-transparent">Livelo</span> por <span className="border-b-4 border-brad-red text-white">saldo em conta</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg leading-relaxed text-slate-300"
            >
              Seus pontos acumulados valem dinheiro de verdade! Faça a conversão de forma transparente e receba o valor direto na sua conta Bradesco ou via Pix. Mais liberdade para usar o que já é seu.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Melhor Taxa</span>
                  <span className="text-[11px] text-slate-400">Cotação garantida</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brad-red/10 text-red-400">
                  <Coins className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Saldo Imediato</span>
                  <span className="text-[11px] text-slate-400">Via Pix ou DOC</span>
                </div>
              </div>

              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-livelo-pink/10 text-pink-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Sem Burocracia</span>
                  <span className="text-[11px] text-slate-400">Cadastro em 1 min</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Right / Interactive Calculator Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-lg sm:p-8">
              
              {/* Card Header */}
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-livelo-pink" />
                  <span className="font-display text-lg font-bold">Simular Resgate</span>
                </div>
                <span className="rounded bg-livelo-pink/20 px-2 py-0.5 font-mono text-[11px] font-bold text-livelo-pink">
                  Cotação Ativa
                </span>
              </div>

              {/* Input Group */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Quantidade de Pontos Livelo:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pointsInput}
                      onChange={handlePointsChange}
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-3.5 pr-12 pl-4 font-display text-2xl font-bold text-white placeholder-slate-500 focus:border-livelo-pink focus:outline-none focus:ring-2 focus:ring-livelo-pink/20"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-xs font-bold text-slate-400">
                      PTS
                    </span>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="rounded-lg bg-white/5 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>

                {/* Speed selector */}
                <div className="pt-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Prazo de Recebimento:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutSpeed("fast")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        payoutSpeed === "fast"
                          ? "border-livelo-pink bg-livelo-pink/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold">Resgate Expresso</span>
                      <span className="text-[10px] text-slate-400">Até 2h via Pix</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutSpeed("standard")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        payoutSpeed === "standard"
                          ? "border-livelo-pink bg-livelo-pink/10 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-bold">Prazo Normal</span>
                      <span className="text-[10px] text-slate-400">Até 24h</span>
                    </button>
                  </div>
                </div>

                {/* Result Section */}
                <div className="mt-6 rounded-xl bg-slate-950 p-4 border border-white/5">
                  <span className="text-xs text-slate-400 block mb-1">
                    Você receberá em sua conta:
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl font-extrabold text-emerald-400">
                      {formatCurrency(estimatedValue)}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Taxa: R$ {payoutSpeed === "standard" ? "18,80" : "18,20"} / 1k pts
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    *Cotação dinâmica sujeita a alterações de mercado.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="button"
                  onClick={handleStartRedemption}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-livelo-pink to-red-500 py-4 font-display text-base font-bold text-white shadow-lg shadow-livelo-pink/20 hover:from-livelo-pink hover:to-red-600 transition-all active:scale-[0.99]"
                >
                  Continuar para Cadastro
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
