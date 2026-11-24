import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const clienteSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefone: { type: String, trim: true },
    observacoes: { type: String, trim: true },
    // preenchido quando o cliente tem conta no sistema (login)
    usuarioId: { type: Schema.Types.ObjectId, ref: "Usuario", default: null },
  },
  { timestamps: true, collection: "clientes" }
);

export type ClienteDoc = InferSchemaType<typeof clienteSchema>;

export const Cliente: Model<ClienteDoc> =
  mongoose.models.Cliente || mongoose.model<ClienteDoc>("Cliente", clienteSchema);
