import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import FormCadastro from "@/components/FormCadastro";

export default async function CadastroPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <FormCadastro />
    </main>
  );
}
