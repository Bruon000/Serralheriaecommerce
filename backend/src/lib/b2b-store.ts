import fs from "fs";
import path from "path";

export type B2BStatus = "pendente" | "aprovado" | "rejeitado";

export type B2BRequest = {
  id: string;
  created_at: string;
  updated_at: string;
  status: B2BStatus;

  doc?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  endereco?: string;
  observacao?: string;
  cidade?: string;
};

const DB_PATH = path.join(process.cwd(), "..", "data", "b2b-requests.json");

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]", "utf8");
  }
}

function normalizeDoc(value?: string) {
  return String(value || "").replace(/\D/g, "").trim();
}

function normalizeEmail(value?: string) {
  return String(value || "").trim().toLowerCase();
}

function readAll(): B2BRequest[] {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw || "[]");
}

function writeAll(list: B2BRequest[]) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), "utf8");
}

function matchesLookup(item: B2BRequest, lookup: { doc?: string; email?: string }) {
  const doc = normalizeDoc(lookup.doc);
  const email = normalizeEmail(lookup.email);

  if (doc && normalizeDoc(item.doc) === doc) return true;
  if (email && normalizeEmail(item.email) === email) return true;
  return false;
}

export function upsertRequest(
  input: Partial<B2BRequest> & { email: string; doc?: string }
): B2BRequest {
  const list = readAll();
  const now = new Date().toISOString();

  const doc = normalizeDoc(input.doc);
  const email = normalizeEmail(input.email);

  if (!email) {
    throw new Error("email obrigatório");
  }

  const existing = list.find((x) => matchesLookup(x, { doc, email }));

  if (existing) {
    const updated: B2BRequest = {
      ...existing,
      ...input,
      doc: doc || existing.doc || undefined,
      email,
      status: existing.status ?? "pendente",
      updated_at: now,
    };
    writeAll(list.map((x) => (x.id === existing.id ? updated : x)));
    return updated;
  }

  const created: B2BRequest = {
    id: "b2b_" + Math.random().toString(36).slice(2),
    created_at: now,
    updated_at: now,
    status: "pendente",
    doc: doc || undefined,
    nome: input.nome,
    email,
    telefone: input.telefone,
    empresa: input.empresa,
    endereco: input.endereco,
    observacao: input.observacao,
    cidade: input.cidade,
  };

  writeAll([created, ...list]);
  return created;
}

export function getByLookup(lookup: { doc?: string; email?: string }): B2BRequest | null {
  const list = readAll();
  return list.find((x) => matchesLookup(x, lookup)) ?? null;
}

export function listAll(): B2BRequest[] {
  return readAll();
}

export function setStatusByLookup(
  lookup: { doc?: string; email?: string },
  status: B2BStatus
): B2BRequest {
  const list = readAll();
  const now = new Date().toISOString();

  const existing = list.find((x) => matchesLookup(x, lookup));
  if (!existing) throw new Error("B2B request not found");

  const updated: B2BRequest = {
    ...existing,
    status,
    updated_at: now,
  };

  writeAll(list.map((x) => (x.id === existing.id ? updated : x)));
  return updated;
}

/** Update status by document (doc) only. */
export function setStatus(doc: string, status: B2BStatus): B2BRequest {
  return setStatusByLookup({ doc }, status);
}
