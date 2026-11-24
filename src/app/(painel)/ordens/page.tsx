import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ListaOrdens from "@/components/ListaOrdens";

export default async function OrdensPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{role === "cliente" ? "Minhas ordens de serviço" : "Ordens de serviço"}</h1>
        <p className="text-sm text-muted-foreground">
          {role === "cliente"
            ? "Acompanhe o andamento dos seus equipamentos na assistência."
            : role === "tecnico"
              ? "As ordens atribuídas a você."
              : "Todos os atendimentos da assistência."}
        </p>
      </div>

      <ListaOrdens role={role} />
    </div>
  );
}
