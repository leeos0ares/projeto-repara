// Cria o primeiro administrador direto no banco.
// Uso: npm run criar-admin -- "Seu Nome" admin@repara.com suaSenha
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [nome, emailBruto, senha] = process.argv.slice(2);

if (!nome || !emailBruto || !senha) {
  console.log('Uso: npm run criar-admin -- "Seu Nome" email senha');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI não encontrada. Confira o arquivo .env.local");
  process.exit(1);
}

const email = emailBruto.toLowerCase().trim();

await mongoose.connect(process.env.MONGODB_URI);
const usuarios = mongoose.connection.collection("usuarios");

if (await usuarios.findOne({ email })) {
  console.log("Já existe um usuário com esse e-mail.");
  await mongoose.disconnect();
  process.exit(1);
}

await usuarios.insertOne({
  nome,
  email,
  senhaHash: await bcrypt.hash(senha, 10),
  role: "admin",
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log(`Administrador criado: ${email}`);
await mongoose.disconnect();
