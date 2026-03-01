export async function b2bRegister(payload: any) {
  const res = await fetch(`/api/b2b`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export async function b2bStatus(doc: string) {
  const res = await fetch(`/api/b2b?doc=${encodeURIComponent(doc)}`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
