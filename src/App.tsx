import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import RegistrationForm from "./components/RegistrationForm";
import FAQ from "./components/FAQ";
import SuccessModal from "./components/SuccessModal";
import AdminPanel from "./components/AdminPanel";
import { Lead, LeadStatus } from "./types";
import { Shield, Sparkles, Trophy, Flame, PhoneCall, CheckCircle } from "lucide-react";

export default function App() {
  const [selectedPoints, setSelectedPoints] = useState<number>(50000);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check for admin query parameter or hash on mount, and optional points parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    if (params.get("admin") === "true" || hash === "#admin" || params.get("admin") === "1") {
      setIsAdminMode(true);
    }
    const pointsParam = params.get("points");
    if (pointsParam) {
      const parsed = parseInt(pointsParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setSelectedPoints(parsed);
      }
    }
  }, []);

  // Load leads from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("resgate_livelo_leads");
      if (stored) {
        setLeads(JSON.parse(stored));
      } else {
        // Seed some mock leads for the administrator to see initially, optional but helpful
        const initialMock: Lead[] = [
          {
            id: "L-X8K9J2P",
            name: "Carlos Eduardo Oliveira",
            cpf: "458.129.083-42",
            emailLivelo: "carlos.edu@gmail.com",
            points: 120000,
            phone: "(73) 98822-1133",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
            status: "Novo" as any,
            estimatedValue: 2184.0,
          },
          {
            id: "L-K9W8S1Q",
            name: "Mariana Costa Silva",
            cpf: "389.210.554-18",
            emailLivelo: "mari.costa@hotmail.com",
            points: 45000,
            phone: "(11) 97744-8899",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
            status: "Em Contato" as any,
            estimatedValue: 819.0,
          },
        ];
        localStorage.setItem("resgate_livelo_leads", JSON.stringify(initialMock));
        setLeads(initialMock);
      }
    } catch (e) {
      console.error("Erro ao carregar do localStorage", e);
    }
  }, []);

  // Save leads to localStorage helper
  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    try {
      localStorage.setItem("resgate_livelo_leads", JSON.stringify(updatedLeads));
    } catch (e) {
      console.error("Erro ao salvar no localStorage", e);
    }
  };

  const handlePointsSelected = (points: number) => {
    setSelectedPoints(points);
  };

  const handleNewLeadSuccess = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    setCurrentLead(newLead);
    setIsSuccessOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map((lead) =>
      lead.id === id ? { ...lead, status: newStatus } : lead
    );
    saveLeadsToStorage(updated);
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter((lead) => lead.id !== id);
    saveLeadsToStorage(updated);
  };

  const handleClearAll = () => {
    saveLeadsToStorage([]);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Admin Mode Floating Header */}
      {isAdminMode && (
        <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-2 px-4 text-center flex flex-wrap items-center justify-center gap-2 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 font-semibold text-livelo-pink">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-livelo-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-livelo-pink"></span>
            </span>
            Modo Administrador Ativo
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-slate-300">Este link de acesso é privado. Seus clientes não têm acesso ao painel de leads no link padrão.</span>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="ml-2 bg-livelo-pink hover:bg-livelo-magenta text-white font-bold px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer"
          >
            Abrir Painel
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onAdminClick={() => setIsAdminOpen(true)}
        onScrollToRegister={() => scrollToSection("cadastro")}
        isAdminMode={isAdminMode}
      />

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Interactive Hero with points calculator */}
        <Hero
          onPointsSelected={handlePointsSelected}
          onScrollToRegister={() => scrollToSection("cadastro")}
        />

        {/* Benefits section */}
        <Features />

        {/* Secure Form Registration section */}
        <RegistrationForm
          initialPoints={selectedPoints}
          onSubmitSuccess={handleNewLeadSuccess}
        />

        {/* Accordion FAQ section */}
        <FAQ />

      </main>

      {/* Trust Badges Footer Area (Matches the design details of the image) */}
      <section className="bg-brad-dark text-white py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            
            <div className="flex flex-col items-center p-4 border border-white/5 rounded-xl bg-white/5">
              <CheckCircle className="h-8 w-8 text-emerald-400 mb-2" />
              <span className="font-display text-xs font-bold uppercase tracking-wider block">
                Atendimento
              </span>
              <span className="text-[10px] text-slate-400 mt-1">RÁPIDO E HUMANO</span>
            </div>

            <div className="flex flex-col items-center p-4 border border-white/5 rounded-xl bg-white/5">
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <span className="font-display text-xs font-bold uppercase tracking-wider block">
                Processo
              </span>
              <span className="text-[10px] text-slate-400 mt-1">100% SEGURO</span>
            </div>

            <div className="flex flex-col items-center p-4 border border-white/5 rounded-xl bg-white/5">
              <Sparkles className="h-8 w-8 text-livelo-pink mb-2" />
              <span className="font-display text-xs font-bold uppercase tracking-wider block">
                Melhores Taxas
              </span>
              <span className="text-[10px] text-slate-400 mt-1">DO MERCADO</span>
            </div>

            <div className="flex flex-col items-center p-4 border border-white/5 rounded-xl bg-white/5">
              <Trophy className="h-8 w-8 text-amber-400 mb-2" />
              <span className="font-display text-xs font-bold uppercase tracking-wider block">
                Satisfação
              </span>
              <span className="text-[10px] text-slate-400 mt-1">GARANTIDA</span>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 flex items-center justify-center rounded bg-brad-red text-white font-extrabold text-sm">
                b
              </div>
              <span>© {new Date().getFullYear()} Resgate de Pontos Livelo Bradesco. Todos os direitos reservados.</span>
            </div>
            
            <div className="flex gap-4">
              <a href="#cadastro" className="hover:text-white transition-colors">Termos de Uso</a>
              <span>•</span>
              <a href="#cadastro" className="hover:text-white transition-colors">Política de Privacidade</a>
              <span>•</span>
              <span className="text-slate-500 font-mono text-[10px]">Coded for Excellence</span>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Call to Action WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/5573998630223?text=Olá! Gostaria de falar com um especialista sobre o resgate de meus pontos Livelo."
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-transform hover:scale-110 active:scale-95 group relative"
        >
          <PhoneCall className="h-6 w-6 animate-pulse" />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            Suporte WhatsApp
          </span>
        </a>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        lead={currentLead}
        onClose={() => setIsSuccessOpen(false)}
      />

      {/* Admin Panel Drawer */}
      <AdminPanel
        isOpen={isAdminOpen}
        leads={leads}
        onClose={() => setIsAdminOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteLead={handleDeleteLead}
        onClearAll={handleClearAll}
      />

    </div>
  );
}
