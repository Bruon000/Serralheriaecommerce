import fs from "fs";
import path from "path";

export type B2BStatus = "pendente" | "aprovado" | "rejeitado";

export type B2BRequest = {
  id: string;
  created_at: string;
  updated_at: string;
  status: B2BStatus;

  doc: string;
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  endereco?: string;
  observacao?: string;
};

const DB_PATH = path.join(process.cwd(), "data", "b2b-requests.json");
function readAll(): B2BRequest[] {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw || "[]");
}

function writeAll(list: B2BRequest[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), "utf8");
}

export function upsertRequest(input: Partial<B2BRequest> & { doc: string }): B2BRequest {
  const list = readAll();
  const now = new Date().toISOString();

  const existing = list.find((x) => x.doc === input.doc);
  if (existing) {
    const updated: B2BRequest = {
      ...existing,
      ...input,
      status: existing.status ?? "pendente",
      updated_at: now,
    };
    writeAll(list.map((x) => (x.doc === input.doc ? updated : x)));
    return updated;
  }

  const created: B2BRequest = {
    id: "b2b_" + Math.random().toString(36).slice(2),
    created_at: now,
    updated_at: now,
    status: "pendente",
    doc: input.doc,
    nome: input.nome,
    email: input.email,
    telefone: input.telefone,
    empresa: input.empresa,
    endereco: input.endereco,
    observacao: input.observacao,
  };

  writeAll([created, ...list]);
  return created;
}

export function getByDoc(doc: string): B2BRequest | null {
  const list = readAll();
  return list.find((x) => x.doc === doc) ?? null;
}

export function listAll(): B2BRequest[] {
  return readAll();
}

export function setStatus(doc: string, status: B2BStatus): B2BRequest {
  const list = readAll();
  const now = new Date().toISOString();

  const existing = list.find((x) => x.doc === doc);
  if (!existing) throw new Error("B2B request not found");

  const updated = { ...existing, status, updated_at: now };
  writeAll(list.map((x) => (x.doc === doc ? updated : x)));
  return updated;
}

