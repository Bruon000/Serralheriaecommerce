import { listAll, setStatusByLookup } from "../../../../lib/b2b-store";

export async function GET(req: any, res: any) {
  try {
    return res.json({ ok: true, items: listAll() });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}

export async function POST(req: any, res: any) {
  try {
    const body = req.body || {};
    const doc = String(body.doc || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const status = String(body.status || "").trim();

    if (!doc && !email) {
      return res.status(400).json({ message: "doc ou email obrigatório" });
    }

    if (!["pendente", "aprovado", "rejeitado"].includes(status)) {
      return res.status(400).json({ message: "status inválido" });
    }

    const updated = setStatusByLookup({ doc, email }, status as any);
    return res.json({ ok: true, request: updated });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}
