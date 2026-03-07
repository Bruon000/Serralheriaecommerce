import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY, MEDUSA_REGION_ID } from "../../../../lib/medusa";

export const dynamic = "force-dynamic";

export async function GET() {
  const url =
    `${MEDUSA_BACKEND_URL}/store/products?limit=1` +
    (MEDUSA_REGION_ID ? `&region_id=${encodeURIComponent(MEDUSA_REGION_ID)}` : "");

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : {},
    });

    const text = await res.text().catch(() => "");
    return Response.json({
      ok: res.ok,
      status: res.status,
      url,
      bodyPreview: text.slice(0, 300),
    });
  } catch (e: any) {
    return Response.json(
      { ok: false, url, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
