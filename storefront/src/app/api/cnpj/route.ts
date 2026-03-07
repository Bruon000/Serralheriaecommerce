import { NextResponse } from "next/server";

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("cnpj") || "";
  const cnpj = onlyDigits(raw);

  if (cnpj.length !== 14) {
    return NextResponse.json(
      { error: "CNPJ inválido." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Não foi possível consultar este CNPJ agora." },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      cnpj,
      razao_social: data.razao_social || "",
      nome_fantasia: data.nome_fantasia || "",
      municipio: data.municipio || "",
      uf: data.uf || "",
      descricao_situacao_cadastral: data.descricao_situacao_cadastral || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao consultar CNPJ." },
      { status: 500 }
    );
  }
}
