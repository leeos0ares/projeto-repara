import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { Usuario } from "@/models/Usuario";
import { Cliente } from "@/models/Cliente";

export async function POST(req: Request) {
  const body = await req.json();
  const nome = String(body.nome ?? "").trim();
  const email = String(body.email ?? "").toLowerCase().trim();
  const telefone = String(body.telefone ?? "").trim();
  const senha = String(body.senha ?? "");

  if (!nome || !email || !senha) {
    return NextResponse.json({ erro: "Preencha nome, e-mail e senha" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ erro: "E-mail inválido" }, { status: 400 });
  }
  if (senha.length < 6) {
    return NextResponse.json({ erro: "A senha precisa ter pelo menos 6 caracteres" }, { status: 400 });
  }

  await dbConnect();

  const jaExiste = await Usuario.findOne({ email });
  if (jaExiste) {
    return NextResponse.json({ erro: "Já existe uma conta com esse e-mail" }, { status: 409 });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  // role fixo em "cliente": quem cria técnico ou admin é o administrador (Etapa 2)
  const usuario = await Usuario.create({ nome, email, senhaHash, role: "cliente" });

  // Se a assistência já cadastrou esse e-mail no balcão, liga a conta ao cliente existente.
  // Se não, cria um cliente novo.
  const cliente = await Cliente.findOne({ email });
  if (cliente) {
    if (!cliente.usuarioId) {
      cliente.usuarioId = usuario._id;
      await cliente.save();
    }
  } else {
    await Cliente.create({ nome, email, telefone, usuarioId: usuario._id });
  }

  return NextResponse.json({ mensagem: "Conta criada com sucesso" }, { status: 201 });
}
