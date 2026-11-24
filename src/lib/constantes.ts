export const ROLES = ["admin", "tecnico", "cliente"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  tecnico: "Técnico",
  cliente: "Cliente",
};

export const TIPOS_EQUIPAMENTO = [
  "computador",
  "notebook",
  "videogame",
  "controle",
  "monitor",
  "periferico",
  "componente",
  "outro",
] as const;
export type TipoEquipamento = (typeof TIPOS_EQUIPAMENTO)[number];

export const TIPO_EQUIPAMENTO_LABEL: Record<TipoEquipamento, string> = {
  computador: "Computador",
  notebook: "Notebook",
  videogame: "Videogame",
  controle: "Controle",
  monitor: "Monitor",
  periferico: "Periférico",
  componente: "Componente de hardware",
  outro: "Outro",
};
