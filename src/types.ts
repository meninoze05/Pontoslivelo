/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LeadStatus {
  NEW = "Novo",
  CONTACTED = "Em Contato",
  COMPLETED = "Finalizado",
}

export interface Lead {
  id: string;
  name: string;
  cpf: string;
  emailLivelo: string;
  points: number;
  phone: string;
  pixKey?: string;
  accountType?: "Corrente" | "Poupança";
  createdAt: string;
  status: LeadStatus;
  estimatedValue: number;
}

export interface CalculatorSettings {
  ratePerThousand: number; // Competitive rate (e.g. R$ 18.00)
}
