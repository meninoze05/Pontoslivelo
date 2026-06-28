import React, { useState } from "react";
import { X, Search, FileDown, Trash2, CheckCircle2, PhoneCall, RefreshCw, Lock, ArrowRight, TrendingUp, Users, DollarSign, Share2, Copy, Check, QrCode, MessageSquare, ExternalLink, Smartphone, Send } from "lucide-react";
import { Lead, LeadStatus } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  leads: Lead[];
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onClearAll: () => void;
}

export default function AdminPanel({
  isOpen,
  leads,
  onClose,
  onUpdateStatus,
  onDeleteLead,
  onClearAll,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedType, setCopiedType] = useState<'client' | 'admin' | 'custom-client' | null>(null);

  const clientLink = window.location.origin + window.location.pathname;
  const adminLink = window.location.origin + window.location.pathname + "?admin=true";

  // Share Link Generator States
  const [customBaseUrl, setCustomBaseUrl] = useState(() => {
    try {
      return window.location.origin + window.location.pathname;
    } catch {
      return "https://resgate-bradesco.com";
    }
  });
  const [presetPoints, setPresetPoints] = useState<string>("none");
  const [customPointsValue, setCustomPointsValue] = useState<number>(50000);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const templates = [
    {
      title: "🔥 Convite Rápido & Simulador",
      text: "Olá! Sabia que seus pontos Livelo Bradesco valem dinheiro de verdade direto na sua conta? Faça uma simulação rápida sem burocracia e com a melhor cotação do mercado clicando no link: {link}"
    },
    {
      title: "💰 Simulação de Pontos Pré-definida",
      text: "Olá! Fiz uma simulação especial para você resgatar {pontos} pontos Livelo Bradesco por saldo em conta. O dinheiro cai direto no Bradesco ou via Pix em até 2 horas. Veja a cotação real e confirme seu pedido por aqui: {link}"
    },
    {
      title: "🔒 Canal Oficial 100% Seguro",
      text: "Seus pontos Livelo Bradesco estão para expirar ou parados? Evite perder seus benefícios. Faça a transferência direta para o seu saldo de forma oficial, segura e rápida através do link: {link}"
    }
  ];

  const getGeneratedLink = () => {
    let url = customBaseUrl.trim();
    if (!url) {
      try {
        url = window.location.origin + window.location.pathname;
      } catch {
        url = "https://resgate-bradesco.com";
      }
    }
    const params = new URLSearchParams();
    if (presetPoints !== "none") {
      const pts = presetPoints === "custom" ? customPointsValue : parseInt(presetPoints, 10);
      if (!isNaN(pts) && pts > 0) {
        params.append("points", pts.toString());
      }
    }
    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
  };

  const generatedLink = getGeneratedLink();

  const getMessageText = () => {
    const template = templates[selectedTemplateIndex] || templates[0];
    const pointsStr = presetPoints === "none" ? "50.000" : (presetPoints === "custom" ? customPointsValue : parseInt(presetPoints, 10)).toLocaleString("pt-BR");
    return template.text
      .replace("{link}", generatedLink)
      .replace("{pontos}", pointsStr);
  };

  const messageText = getMessageText();

  const copyMessageToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 2000);
      } catch (e) {
        alert("Pressione Ctrl+C para copiar.");
      }
      document.body.removeChild(textArea);
    }
  };

  const copyToClipboard = (text: string, type: 'client' | 'admin' | 'custom-client') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2000);
      } catch (e) {
        alert("Pressione Ctrl+C para copiar: " + text);
      }
      document.body.removeChild(textArea);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "admin123" || password === "livelo") {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta. Tente 'admin123' ou 'livelo'.");
    }
  };

  // Filter and search
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cpf.includes(searchTerm) ||
      lead.emailLivelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("Nenhum lead cadastrado para exportar.");
      return;
    }

    const headers = ["ID", "Nome", "CPF", "Email Livelo", "Telefone", "Pontos", "Pix", "Tipo Conta", "Estimativa R$", "Data Cadastro", "Status"];
    const rows = filteredLeads.map((lead) => [
      lead.id,
      lead.name,
      lead.cpf,
      lead.emailLivelo,
      lead.phone,
      lead.points,
      lead.pixKey || "N/A",
      lead.accountType || "Corrente",
      lead.estimatedValue.toFixed(2),
      new Date(lead.createdAt).toLocaleString("pt-BR"),
      lead.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_resgate_livelo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Statistics
  const totalLeads = leads.length;
  const totalPoints = leads.reduce((acc, lead) => acc + lead.points, 0);
  const totalEstimatedValue = leads.reduce((acc, lead) => acc + lead.estimatedValue, 0);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-4xl bg-white shadow-2xl flex flex-col">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-livelo-pink" />
            <span className="font-display text-lg font-bold">Painel de Controle de Leads</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brad-red/10 text-brad-red mb-3">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">Acesso Restrito</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Insira a senha do administrador para visualizar e exportar os dados cadastrados.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Senha de Acesso:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha admin"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brad-red focus:outline-none focus:ring-2 focus:ring-brad-red/10"
                    autoFocus
                  />
                  {passwordError && (
                    <span className="mt-1 block text-xs font-semibold text-red-500">{passwordError}</span>
                  )}
                  <span className="mt-2 block text-[11px] text-slate-400">
                    *Dica para teste: use a senha <strong>admin123</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brad-red py-3 text-sm font-bold text-white hover:bg-brad-red-dark transition-all"
                >
                  Entrar no Painel
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Panel Content */
          <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-slate-200 bg-white">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Total de Cadastros</span>
                  <span className="font-display text-lg font-bold text-slate-800">{totalLeads}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Soma de Pontos</span>
                  <span className="font-display text-lg font-bold text-slate-800">
                    {totalPoints.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Estimativa Repasse</span>
                  <span className="font-display text-lg font-bold text-slate-800">
                    {formatCurrency(totalEstimatedValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Links Manager */}
            <div className="p-6 bg-white border-b border-slate-200">
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-blue-100/50">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="h-4.5 w-4.5 text-livelo-pink" />
                      Gerador de Link de Compartilhamento para Clientes (Mobile)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Crie links personalizados com simulações de pontos pré-definidas, gere QR Codes para atendimento presencial e compartilhe diretamente no WhatsApp do seu cliente.
                    </p>
                  </div>
                  
                  {/* Admin Link Quick Access */}
                  <div className="shrink-0 flex items-center gap-2 bg-slate-100 rounded-lg p-1 px-2 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Acesso Admin:</span>
                    <button
                      onClick={() => copyToClipboard(adminLink, 'admin')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        copiedType === 'admin'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200'
                      }`}
                    >
                      {copiedType === 'admin' ? "Link Admin Copiado!" : "Copiar Link Admin"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Configuration Area */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Base URL */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        URL Base do Simulador:
                      </label>
                      <input
                        type="text"
                        value={customBaseUrl}
                        onChange={(e) => setCustomBaseUrl(e.target.value)}
                        placeholder="Ex: https://meusite.com.br"
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 font-mono focus:border-livelo-pink focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        *Detectado automaticamente. Altere somente se estiver usando um domínio personalizado.
                      </p>
                    </div>

                    {/* Pre-set Points config */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Pré-configurar Pontos Livelo no Link:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {[
                          { label: "Padrão", value: "none" },
                          { label: "10k pts", value: "10000" },
                          { label: "50k pts", value: "50000" },
                          { label: "100k pts", value: "100000" },
                          { label: "Personalizado", value: "custom" }
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPresetPoints(opt.value)}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                              presetPoints === opt.value
                                ? "bg-livelo-pink border-livelo-pink text-white"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {presetPoints === "custom" && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Qtd de Pontos:</span>
                          <input
                            type="number"
                            value={customPointsValue}
                            onChange={(e) => setCustomPointsValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            placeholder="Ex: 120000"
                            className="w-32 bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 font-bold focus:border-livelo-pink focus:outline-none"
                          />
                          <span className="text-[10px] font-bold text-slate-400">PTS</span>
                        </div>
                      )}
                    </div>

                    {/* Generated Client Link */}
                    <div className="rounded-xl bg-slate-900 text-white p-3.5 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Link Gerado para o Cliente Mobile
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={generatedLink}
                          className="w-full bg-slate-950 rounded-lg border border-slate-800 px-3 py-2 text-xs text-emerald-400 font-mono outline-none select-all"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          onClick={() => copyToClipboard(generatedLink, 'custom-client')}
                          className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                            copiedType === 'custom-client'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-livelo-pink hover:bg-livelo-magenta text-white'
                          }`}
                        >
                          {copiedType === 'custom-client' ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copiar
                            </>
                          )}
                        </button>
                        <a
                          href={generatedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                          title="Abrir em Nova Aba"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and WhatsApp Share builder */}
                  <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-5">
                    
                    {/* QR Code */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Escanear via Celular (QR Code)
                      </span>
                      <div className="p-2 border border-slate-100 rounded-lg bg-slate-50">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(generatedLink)}`}
                          alt="QR Code de Compartilhamento"
                          referrerPolicy="no-referrer"
                          className="h-28 w-28 block bg-white"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 leading-tight">
                        Aponte a câmera para abrir instantaneamente no dispositivo móvel do cliente.
                      </span>
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(generatedLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 mt-2.5 inline-flex items-center gap-1"
                      >
                        <FileDown className="h-3.5 w-3.5" /> Expandir QR Code
                      </a>
                    </div>

                    {/* WhatsApp Action Card */}
                    <div className="flex-1 flex flex-col justify-between p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                          Compartilhar no WhatsApp
                        </span>
                        
                        {/* Selector of Templates */}
                        <div className="mb-2">
                          <select
                            value={selectedTemplateIndex}
                            onChange={(e) => setSelectedTemplateIndex(parseInt(e.target.value, 10))}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
                          >
                            {templates.map((tmpl, idx) => (
                              <option key={idx} value={idx}>
                                {tmpl.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Message Preview */}
                        <textarea
                          readOnly
                          value={messageText}
                          className="w-full h-24 bg-white rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] text-slate-600 font-sans resize-none outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3.5">
                        <button
                          type="button"
                          onClick={() => copyMessageToClipboard(messageText)}
                          className={`w-full py-2 rounded-lg text-xs font-bold transition-all border text-center cursor-pointer ${
                            copiedMsg
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {copiedMsg ? "Texto Copiado!" : "Copiar Texto"}
                        </button>
                        
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(messageText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Enviar WhatsApp
                        </a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
              {/* Search bar */}
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, CPF, e-mail..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-xs focus:border-brad-red focus:outline-none"
                />
              </div>

              {/* Action buttons / Filters */}
              <div className="flex w-full md:w-auto items-center gap-3 justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none font-medium text-slate-700"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="Novo">Novos</option>
                  <option value="Em Contato">Em Contato</option>
                  <option value="Finalizado">Finalizados</option>
                </select>

                <button
                  type="button"
                  onClick={exportToCSV}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileDown className="h-4 w-4 text-emerald-600" />
                  CSV
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Deseja realmente limpar TODOS os cadastros salvos localmente?")) {
                      onClearAll();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar Tudo
                </button>
              </div>
            </div>

            {/* Leads Table Container */}
            <div className="flex-1 p-6">
              {filteredLeads.length === 0 ? (
                <div className="h-64 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 bg-white text-center">
                  <Users className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Nenhum cadastro encontrado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Os cadastros enviados pelo formulário aparecerão listados aqui.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto max-w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                          <th className="px-4 py-3">Cliente</th>
                          <th className="px-4 py-3">CPF</th>
                          <th className="px-4 py-3">E-mail Livelo</th>
                          <th className="px-4 py-3">Pontos / Cot.</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredLeads.map((lead) => {
                          const hasPix = !!lead.pixKey;
                          return (
                            <tr key={lead.id} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-slate-800">{lead.name}</div>
                                <div className="text-[10px] text-slate-400">{lead.phone}</div>
                                <div className="text-[9px] text-slate-400 font-mono">ID: {lead.id}</div>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-slate-600">
                                {lead.cpf}
                              </td>
                              <td className="px-4 py-3.5 text-slate-600 max-w-[120px] truncate" title={lead.emailLivelo}>
                                {lead.emailLivelo}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-slate-800">{lead.points.toLocaleString("pt-BR")} pts</div>
                                <div className="text-[10px] font-bold text-emerald-600">{formatCurrency(lead.estimatedValue)}</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    lead.status === "Novo"
                                      ? "bg-blue-100 text-blue-700"
                                      : lead.status === "Em Contato"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {lead.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-1.5">
                                  {/* Contacted */}
                                  <button
                                    onClick={() => onUpdateStatus(lead.id, "Em Contato" as any)}
                                    title="Marcar como Em Contato"
                                    className="rounded p-1 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                                  >
                                    <PhoneCall className="h-4 w-4" />
                                  </button>
                                  {/* Completed */}
                                  <button
                                    onClick={() => onUpdateStatus(lead.id, "Finalizado" as any)}
                                    title="Marcar como Finalizado"
                                    className="rounded p-1 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  {/* Delete */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Excluir lead de ${lead.name}?`)) {
                                        onDeleteLead(lead.id);
                                      }
                                    }}
                                    title="Excluir cadastro"
                                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
