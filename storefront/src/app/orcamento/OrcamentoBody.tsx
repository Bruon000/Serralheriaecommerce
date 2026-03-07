"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Modelo =
  | "Portão de correr"
  | "Portão de abrir (2 folhas)"
  | "Portão social"
  | "Grade"
  | "Corrimão"
  | "Estrutura metálica";

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

const inputBase =
  "h-11 w-full rounded-xl border border-border/50 bg-black/35 px-4 text-sm text-foreground outline-none " +
  "focus:ring-2 focus:ring-[rgba(245,158,11,0.28)] focus:border-[rgba(245,158,11,0.28)]";

const labelBase = "text-xs font-extrabold tracking-wider text-foreground/80";

function OrcamentoContent() {
  const searchParams = useSearchParams();

  const produtoNome = searchParams.get("nome") || "";
  const produtoHandle = searchParams.get("produto") || "";

  const qpLargura = searchParams.get("largura") || "";
  const qpAltura = searchParams.get("altura") || "";

  const [nomeCliente, setNomeCliente] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [modelo, setModelo] = useState<Modelo>("Portão de correr");
  const [largura, setLargura] = useState<string>("3.00");
  const [altura, setAltura] = useState<string>("2.00");
  const [cidade, setCidade] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");

  useEffect(() => {
    if (qpLargura.trim()) setLargura(qpLargura.trim());
    if (qpAltura.trim()) setAltura(qpAltura.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whatsappNumber = useMemo(() => {
    return onlyDigits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5584987940211");
  }, []);

  const msg = useMemo(() => {
    const parts: string[] = [];
    parts.push("Olá! Quero um orçamento.");

    if (produtoNome) {
      parts.push(`Produto: ${produtoNome}${produtoHandle ? ` (ref: ${produtoHandle})` : ""}`);
      if (typeof window !== "undefined" && produtoHandle) {
        parts.push(`Link: ${window.location.origin}/produto/${produtoHandle}`);
      }
    }

    parts.push("");
    if (nomeCliente.trim()) parts.push(`Nome: ${nomeCliente.trim()}`);
    if (telefone.trim()) parts.push(`Telefone/WhatsApp: ${telefone.trim()}`);
    parts.push(`Modelo: ${modelo}`);
    parts.push(`Medidas: ${largura} m (L) x ${altura} m (A)`);
    if (cidade.trim()) parts.push(`Cidade/Bairro: ${cidade.trim()}`);
    if (observacoes.trim()) parts.push(`Obs.: ${observacoes.trim()}`);
    parts.push("");
    parts.push("Pode me passar uma estimativa e prazo?");
    return parts.join("\n");
  }, [produtoNome, produtoHandle, nomeCliente, telefone, modelo, largura, altura, cidade, observacoes]);

  const waUrl = useMemo(() => {
    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${whatsappNumber}?text=${encoded}`;
  }, [whatsappNumber, msg]);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Orçamento <span className="text-gradient-gold">rápido</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha as informações e receba seu orçamento em minutos pelo WhatsApp!
          </p>
        </div>

        <div
          className="rounded-3xl border border-border/40 bg-black/35 backdrop-blur p-5 md:p-8"
          style={{ boxShadow: "0 18px 55px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,158,11,0.10)" }}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <label className={labelBase}>Nome</label>
                  <input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} placeholder="Digite seu nome completo" className={inputBase} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <label className={labelBase}>Telefone/WhatsApp</label>
                  <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(DDD) 9XXXX-XXXX" required className={inputBase} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <label className={labelBase}>Modelo</label>
                  <select value={modelo} onChange={(e) => setModelo(e.target.value as Modelo)} className={inputBase}>
                    <option>Portão de correr</option>
                    <option>Portão de abrir (2 folhas)</option>
                    <option>Portão social</option>
                    <option>Grade</option>
                    <option>Corrimão</option>
                    <option>Estrutura metálica</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className={labelBase}>Largura (m)</label>
                  <input value={largura} onChange={(e) => setLargura(e.target.value)} inputMode="decimal" placeholder="Ex.: 3.00" className={inputBase} />
                </div>

                <div className="grid gap-2">
                  <label className={labelBase}>Altura (m)</label>
                  <input value={altura} onChange={(e) => setAltura(e.target.value)} inputMode="decimal" placeholder="Ex.: 2.00" className={inputBase} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <label className={labelBase}>Cidade/Bairro (opcional)</label>
                  <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Digite sua cidade e bairro" className={inputBase} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <label className={labelBase}>Observações (opcional)</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                    placeholder="Ex.: com portinhola, reforço, motor, tipo de chapa..."
                    className="w-full rounded-xl border border-border/50 bg-black/35 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-[rgba(245,158,11,0.28)]"
                  />
                </div>
              </div>
            </section>

            <aside className="grid gap-4">
              <div className="rounded-2xl border border-border/40 bg-black/25 p-5">
                <div className="text-sm font-extrabold text-foreground/90">Enviar agora</div>
                <p className="mt-1 text-sm text-muted-foreground">Abre o WhatsApp já com a mensagem pronta.</p>

                <div className="mt-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex justify-center items-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110 hover:shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
                  >
                    Enviar no WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrcamentoBody() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background pt-24 pb-16"><div className="container animate-pulse">Carregando...</div></main>}>
      <OrcamentoContent />
    </Suspense>
  );
}

