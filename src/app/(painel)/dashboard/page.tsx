import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABEL, type Role } from "@/lib/constantes";

const resumo: Record<Role, string> = {
  admin: "O resumo geral das ordens de serviço e a distribuição entre técnicos entram na Etapa 4.",
  tecnico: "As ordens atribuídas a você e os equipamentos aguardando diagnóstico entram na Etapa 4.",
  cliente: "Seus equipamentos, orçamentos e o que está pronto para retirada entram na Etapa 4.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { name, role } = session.user;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Olá, {name?.split(" ")[0]}</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Painel do {ROLE_LABEL[role].toLowerCase()}</CardTitle>
          <CardDescription>Login e sessão funcionando.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{resumo[role]}</CardContent>
      </Card>
    </div>
  );
}
