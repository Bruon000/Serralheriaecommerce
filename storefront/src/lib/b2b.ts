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

export async function b2bStatus(doc: string, email?: string) {
  const qs = new URLSearchParams();
  if (doc) qs.set("doc", doc);
  if (email) qs.set("email", email);

  const res = await fetch(`/api/b2b?${qs.toString()}`, {
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export async function b2bAdminList(user: string, pass: string) {
  const res = await fetch(`/api/b2b/admin`, {
    cache: "no-store",
    headers: {
      "x-admin-user": user,
      "x-admin-pass": pass,
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export async function b2bAdminSetStatus(
  payload: { doc?: string; status: "pendente" | "aprovado" | "rejeitado" },
  user: string,
  pass: string
) {
  const res = await fetch(`/api/b2b/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-user": user,
      "x-admin-pass": pass,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
