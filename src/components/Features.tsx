import React from "react";
import { Coins, UserCheck, Shield, PhoneCall, Headphones, Sparkles } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: <Coins className="h-6 w-6 text-livelo-pink" />,
      title: "Converta seus pontos Livelo",
      description: "Todos os seus pontos acumulados no Bradesco Fidelidade e Livelo podem ser revertidos em dinheiro de forma simples.",
    },
    {
      icon: <UserCheck className="h-6 w-6 text-brad-red" />,
      title: "Receba direto no Bradesco",
      description: "Transferência direta e rápida para sua conta-corrente Bradesco cadastrada ou via Pix na chave que preferir.",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "Segurança e transparência",
      description: "Sem pegadinhas ou taxas ocultas. Transação monitorada de ponta a ponta para garantir sua total segurança.",
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-emerald-500" />,
      title: "Atendimento especializado",
      description: "Suporte consultivo e humanizado direto por especialistas via WhatsApp para tirar qualquer dúvida na hora.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center pb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brad-red">
            COMO FUNCIONA
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sua melhor experiência em resgate de milhas e pontos
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Unimos agilidade, tecnologia e atendimento humano para garantir que seus pontos acumulados se transformem no saldo que você merece para realizar seus planos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-start rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
            >
              <div className="mb-4 rounded-xl bg-slate-50 p-3 group-hover:bg-slate-100 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp Callout bar */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-brad-dark-blue to-slate-900 p-6 shadow-xl text-white sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Headphones className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold">Prefere atendimento pelo WhatsApp?</h4>
              <p className="text-sm text-slate-400">Fale agora mesmo com um de nossos especialistas dedicados.</p>
            </div>
          </div>
          <a
            href="https://wa.me/5573998630223"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98] w-full md:w-auto justify-center"
          >
            <PhoneCall className="h-4.5 w-4.5" />
            Chamar no WhatsApp (73) 99863-0223
          </a>
        </div>

      </div>
    </section>
  );
}
