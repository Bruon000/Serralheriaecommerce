import { listAll, setStatus } from "../../../../lib/b2b-store";

// Medusa custom admin route: /admin/custom/b2b
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
    const status = String(body.status || "").trim(); // pendente/aprovado/rejeitado
    if (!doc) return res.status(400).json({ message: "doc obrigatório" });
    if (!["pendente","aprovado","rejeitado"].includes(status)) return res.status(400).json({ message: "status inválido" });

    const updated = setStatus(doc, status as any);
    return res.json({ ok: true, request: updated });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || String(e) });
  }
}

