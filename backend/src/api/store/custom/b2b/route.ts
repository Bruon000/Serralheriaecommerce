import { getByLookup, upsertRequest } from "../../../../lib/b2b-store";

function setCors(req: any, res: any) {
  const origin = req.headers?.origin || "*";

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-publishable-api-key, Authorization"
  );
}

export async function OPTIONS(req: any, res: any) {
  setCors(req, res);
  return res.status(204).send("");
}

export async function POST(req: any, res: any) {
  setCors(req, res);

  try {
    const body = req.body || {};
    const email = String(body.email || "").trim().toLowerCase();
    const doc = String(body.doc || "").trim();

    if (!email) {
      return res.status(400).json({ message: "email obrigatório" });
    }

    const saved = upsertRequest({
      doc,
      nome: body.nome,
      email,
      telefone: body.telefone,
      empresa: body.empresa,
      endereco: body.endereco,
      observacao: body.observacao,
      cidade: body.cidade,
    });

    return res.json({ ok: true, request: saved });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}

export async function GET(req: any, res: any) {
  setCors(req, res);

  try {
    const doc = String(req.query?.doc ?? "").trim();
    const email = String(req.query?.email ?? "").trim().toLowerCase();

    if (!doc && !email) {
      return res.status(400).json({ message: "doc ou email obrigatório" });
    }

    const found = getByLookup({ doc, email });
    if (!found) {
      return res.json({ ok: true, status: "nao_encontrado" });
    }

    return res.json({ ok: true, status: found.status, request: found });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}
