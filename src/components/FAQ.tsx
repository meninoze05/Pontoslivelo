import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como funciona a troca de pontos Livelo por saldo em conta?",
      answer: "Você faz seu cadastro informando a quantidade de pontos que possui. Nossa equipe avalia a melhor cotação do dia para os pontos Livelo do Bradesco. Após o cadastro, você entra em contato pelo WhatsApp e nós realizamos a transferência rápida do valor diretamente para sua conta Bradesco ou Pix.",
    },
    {
      question: "Quais são os dados necessários para o cadastro?",
      answer: "Para garantir a segurança, solicitamos o seu Nome Completo, CPF e o E-mail cadastrado na Livelo. Esses dados servem exclusivamente para validar a integridade da cotação e emitir o resgate do saldo correto.",
    },
    {
      question: "Qual o prazo para receber o dinheiro na minha conta?",
      answer: "No modo de Resgate Expresso, o valor é creditado na sua conta cadastrada ou via Pix em até 2 horas úteis após a validação no sistema. No resgate padrão, o processamento pode levar até 24 horas.",
    },
    {
      question: "É seguro fazer o resgate por este site?",
      answer: "Sim, absolutamente. Não solicitamos nenhuma senha de acesso da sua conta Livelo ou banco. A transferência é feita com base nas informações públicas da cotação e o contato consultivo é efetuado de forma transparente via WhatsApp oficial.",
    },
    {
      question: "Existe um limite mínimo ou máximo de pontos para resgatar?",
      answer: "Recomendamos resgates a partir de 5.000 pontos Livelo para que a taxa de conversão seja altamente competitiva. Não há limite máximo de pontos para conversão diária.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-slate-50 py-20 border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center pb-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-livelo-pink/10 text-livelo-pink mb-3">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
            Dúvidas Frequentes (FAQ)
          </h2>
          <p className="mt-2 text-slate-500">
            Encontre respostas rápidas sobre o funcionamento do nosso sistema de resgates.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-display font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                    <p className="text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
