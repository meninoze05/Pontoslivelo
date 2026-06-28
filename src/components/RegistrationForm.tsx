import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, CreditCard, Gift, ShieldAlert, CheckCircle, RefreshCw, Smartphone, KeyRound } from "lucide-react";
import { Lead } from "../types";

interface RegistrationFormProps {
  initialPoints: number;
  onSubmitSuccess: (lead: Lead) => void;
}

export default function RegistrationForm({ initialPoints, onSubmitSuccess }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [emailLivelo, setEmailLivelo] = useState("");
  const [points, setPoints] = useState(initialPoints || 50000);
  const [pointsString, setPointsString] = useState("");
  const [phone, setPhone] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [accountType, setAccountType] = useState<"Corrente" | "Poupança">("Corrente");
  const [lgpdChecked, setLgpdChecked] = useState(true);

  // Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync points with initialPoints changes
  useEffect(() => {
    if (initialPoints) {
      setPoints(initialPoints);
      setPointsString(initialPoints.toLocaleString("pt-BR"));
    } else {
      setPointsString((50000).toLocaleString("pt-BR"));
    }
  }, [initialPoints]);

  // Handle CPF input with mask
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Apply mask (000.000.000-00)
    let masked = value;
    if (value.length > 3) masked = `${value.slice(0, 3)}.${value.slice(3)}`;
    if (value.length > 6) masked = `${masked.slice(0, 7)}.${value.slice(6)}`;
    if (value.length > 9) masked = `${masked.slice(0, 11)}-${value.slice(9)}`;

    setCpf(masked);
    // clear error
    if (errors.cpf) {
      setErrors((prev) => ({ ...prev, cpf: "" }));
    }
  };

  // Handle Phone input with mask ( (99) 99999-9999 )
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    let masked = value;
    if (value.length > 0) masked = `(${value}`;
    if (value.length > 2) masked = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) {
      masked = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }

    setPhone(masked);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const numeric = rawVal ? parseInt(rawVal, 10) : 0;
    if (numeric > 2000000) return; // Cap at 2M points

    setPoints(numeric);
    setPointsString(numeric.toLocaleString("pt-BR"));
  };

  // CPF Validation logic (Brazilian standard)
  const isCpfValid = (rawCpf: string): boolean => {
    const clean = rawCpf.replace(/\D/g, "");
    if (clean.length !== 11) return false;
    if (/^(\d)\1+$/.test(clean)) return false; // ignore 11111111111, etc.
    
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean[i], 10) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(clean[9], 10)) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean[i], 10) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(clean[10], 10)) return false;

    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim() || name.trim().split(" ").length < 2) {
      newErrors.name = "Por favor, digite seu nome completo (Nome e Sobrenome).";
    }

    if (!cpf) {
      newErrors.cpf = "O CPF é obrigatório.";
    } else if (!isCpfValid(cpf)) {
      newErrors.cpf = "CPF inválido. Verifique os dígitos.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLivelo) {
      newErrors.emailLivelo = "O e-mail cadastrado na Livelo é obrigatório.";
    } else if (!emailRegex.test(emailLivelo)) {
      newErrors.emailLivelo = "Insira um endereço de e-mail válido.";
    }

    const rawPhone = phone.replace(/\D/g, "");
    if (!phone) {
      newErrors.phone = "O telefone de contato é obrigatório.";
    } else if (rawPhone.length < 10) {
      newErrors.phone = "Insira um telefone válido com DDD.";
    }

    if (!lgpdChecked) {
      newErrors.lgpd = "Você precisa autorizar o contato para simular o resgate.";
    }

    if (points <= 0) {
      newErrors.points = "Informe a quantidade de pontos que deseja resgatar.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate database insertion (leads)
    setTimeout(() => {
      // Calculate estimation
      const rate = 18.20;
      const val = (points / 1000) * rate;

      const newLead: Lead = {
        id: "L-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: name.trim(),
        cpf: cpf,
        emailLivelo: emailLivelo.trim().toLowerCase(),
        points: points,
        phone: phone,
        pixKey: pixKey.trim() || undefined,
        accountType: accountType,
        createdAt: new Date().toISOString(),
        status: "Novo" as any, // initial status is NEW
        estimatedValue: val,
      };

      setIsSubmitting(false);
      onSubmitSuccess(newLead);

      // Clear fields
      setName("");
      setCpf("");
      setEmailLivelo("");
      setPhone("");
      setPixKey("");
    }, 1500);
  };

  return (
    <section id="cadastro" className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="mx-auto max-w-2xl text-center pb-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brad-red/10 text-brad-red mb-3">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Realize Seu Cadastro Seguro
          </h2>
          <p className="mt-2 text-slate-500">
            Preencha seus dados para solicitar a simulação de conversão. Seus dados estão protegidos sob protocolos rígidos de segurança.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="João Silva dos Santos"
                    className={`w-full rounded-xl border bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 ${
                      errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brad-red"
                    }`}
                  />
                </div>
                {errors.name && (
                  <span className="mt-1 text-xs font-medium text-red-500">{errors.name}</span>
                )}
              </div>

              {/* CPF */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  CPF
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <CreditCard className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className={`w-full rounded-xl border bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 ${
                      errors.cpf ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brad-red"
                    }`}
                  />
                </div>
                {errors.cpf && (
                  <span className="mt-1 text-xs font-medium text-red-500">{errors.cpf}</span>
                )}
              </div>

              {/* Email Livelo */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  E-mail cadastrado na Livelo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="email"
                    value={emailLivelo}
                    onChange={(e) => {
                      setEmailLivelo(e.target.value);
                      if (errors.emailLivelo) setErrors((prev) => ({ ...prev, emailLivelo: "" }));
                    }}
                    placeholder="exemplo@email.com"
                    className={`w-full rounded-xl border bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 ${
                      errors.emailLivelo ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brad-red"
                    }`}
                  />
                </div>
                {errors.emailLivelo && (
                  <span className="mt-1 text-xs font-medium text-red-500">{errors.emailLivelo}</span>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Smartphone className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(73) 99863-0223"
                    className={`w-full rounded-xl border bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 ${
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brad-red"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <span className="mt-1 text-xs font-medium text-red-500">{errors.phone}</span>
                )}
              </div>

              {/* Points slider / input */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Pontos Estimados Livelo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Gift className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={pointsString}
                    onChange={handlePointsChange}
                    placeholder="50.000"
                    className={`w-full rounded-xl border bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 ${
                      errors.points ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brad-red"
                    }`}
                  />
                </div>
                {errors.points && (
                  <span className="mt-1 text-xs font-medium text-red-500">{errors.points}</span>
                )}
              </div>

              {/* Pix Key (Optional) */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Chave Pix (Para Recebimento - Opcional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <KeyRound className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="Chave Pix (CPF, Celular, E-mail ou Aleatória)"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brad-red/10 focus:border-brad-red"
                  />
                </div>
              </div>
            </div>

            {/* Account Type details */}
            <div className="border-t border-slate-200 pt-4">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Tipo de Conta Bradesco Preferencial:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === "Corrente"}
                    onChange={() => setAccountType("Corrente")}
                    className="h-4 w-4 text-brad-red focus:ring-brad-red border-slate-300"
                  />
                  Conta-Corrente
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === "Poupança"}
                    onChange={() => setAccountType("Poupança")}
                    className="h-4 w-4 text-brad-red focus:ring-brad-red border-slate-300"
                  />
                  Poupança
                </label>
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="flex flex-col space-y-1 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdChecked}
                  onChange={(e) => {
                    setLgpdChecked(e.target.checked);
                    if (errors.lgpd) setErrors((prev) => ({ ...prev, lgpd: "" }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brad-red focus:ring-brad-red"
                />
                <span className="text-xs text-slate-500 leading-normal">
                  Autorizo o contato de especialista pelo telefone/e-mail fornecido e estou de acordo com a simulação de resgate dos meus pontos Livelo na minha conta Bradesco, nos termos da Lei Geral de Proteção de Dados (LGPD).
                </span>
              </label>
              {errors.lgpd && (
                <span className="mt-1 text-xs font-medium text-red-500">{errors.lgpd}</span>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brad-red py-4 text-center font-display text-base font-bold text-white shadow-lg shadow-brad-red/10 hover:bg-brad-red-dark transition-all disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Processando Cadastro...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Finalizar Cadastro e Simular Resgate
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
