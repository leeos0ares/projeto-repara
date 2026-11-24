export const ROLES = ["admin", "tecnico", "cliente"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  tecnico: "Técnico",
  cliente: "Cliente",
};
