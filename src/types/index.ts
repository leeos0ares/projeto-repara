import type { Role, TipoEquipamento } from "@/lib/constantes";

// Formato dos dados como chegam das rotas /api (JSON)
export type ClienteItem = {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  observacoes?: string;
  usuarioId?: string | null;
};

export type EquipamentoItem = {
  _id: string;
  clienteId: { _id: string; nome: string };
  tipo: TipoEquipamento;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  descricao?: string;
  especificacoes?: {
    processador?: string;
    memoriaRam?: string;
    placaVideo?: string;
    armazenamento?: string;
  };
  observacoes?: string;
};

export type UsuarioItem = {
  _id: string;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
};

export type Aviso = { tipo: "erro" | "sucesso"; texto: string };
