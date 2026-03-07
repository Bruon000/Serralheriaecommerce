import { listAll, setStatus } from "../../../../lib/b2b-store";

function setCors(req: any, res: any) {
  const origin = req.headers?.origin || "*";

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-publishable-api-key, x-b2b-admin-token, Authorization"
  );
}

function isAuthorized(req: any) {
  const expected = process.env.B2B_ADMIN_TOKEN || "";
  const received = String(req.headers["x-b2b-admin-token"] || "").trim();
  return Boolean(expected) && received === expected;
}

// Medusa custom route: /store/custom/b2b-admin
export async function OPTIONS(req: any, res: any) {
  setCors(req, res);
  return res.status(204).send("");
}

export async function GET(req: any, res: any) {
  setCors(req, res);

  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    return res.json({ ok: true, items: listAll() });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}

export async function POST(req: any, res: any) {
  setCors(req, res);

  try {
    if (!isAuthorized(req)) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const body = req.body || {};
    const doc = String(body.doc || "").trim();
    const status = String(body.status || "").trim();

    if (!doc) return res.status(400).json({ message: "doc obrigatório" });
    if (!["pendente", "aprovado", "rejeitado"].includes(status)) {
      return res.status(400).json({ message: "status inválido" });
    }

    const updated = setStatus(doc, status as any);
    return res.json({ ok: true, request: updated });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}
