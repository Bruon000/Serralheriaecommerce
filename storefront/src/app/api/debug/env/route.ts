export const dynamic = "force-dynamic";

export async function GET() {
  const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? process.env.MEDUSA_PUBLISHABLE_KEY ?? "";
  const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? process.env.MEDUSA_BACKEND_URL ?? "";
  const region = process.env.NEXT_PUBLIC_REGION_ID ?? "";

  const masked = pk ? pk.slice(0, 8) + "..." + pk.slice(-6) : "";

  return Response.json({
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: url,
    NEXT_PUBLIC_REGION_ID: region,
    MEDUSA_PUBLISHABLE_KEY_masked: masked,
    pk_len: pk.length,
  });
}
