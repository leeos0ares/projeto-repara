export function formatarData(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function formatarDataHora(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function formatarMoeda(valor?: number | null) {
  return (valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// 7 -> "#0007"
export function numeroOS(numero: number) {
  return `#${String(numero).padStart(4, "0")}`;
}
