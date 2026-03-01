import { getByDoc, upsertRequest } from "../../../../lib/b2b-store";

function setCors(req: any, res: any) {
  const origin = req.headers?.origin || "*";

  // Dev: libera o origin que chamou (localhost:3000)
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-publishable-api-key, Authorization"
  );
}

// Medusa custom route: /store/custom/b2b
export async function OPTIONS(req: any, res: any) {
  setCors(req, res);
  return res.status(204).send("");
}

export async function POST(req: any, res: any) {
  setCors(req, res);

  try {
    const body = req.body || {};
    const doc = String(body.doc || "").trim();
    if (!doc) return res.status(400).json({ message: "doc obrigatório" });

    const saved = upsertRequest({
      doc,
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      empresa: body.empresa,
      endereco: body.endereco,
      observacao: body.observacao,
    });

    return res.json({ ok: true, request: saved });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}

export async function GET(req: any, res: any) {
  setCors(req, res);

  try {
    const doc = String((req.query?.doc ?? "")).trim();
    if (!doc) return res.status(400).json({ message: "doc obrigatório" });

    const found = getByDoc(doc);
    if (!found) return res.json({ ok: true, status: "nao_encontrado" });

    return res.json({ ok: true, status: found.status, request: found });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}
