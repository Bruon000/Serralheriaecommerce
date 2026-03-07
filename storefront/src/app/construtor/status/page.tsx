"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { b2bStatus } from "../../../lib/b2b";

export default function StatusConstrutor() {
  const [doc, setDoc] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const d = localStorage.getItem("construtor_doc_v1") || "";
    const e = localStorage.getItem("construtor_email_v1") || "";
    setDoc(d);
    setEmail(e);

    if (!d && !e) return;

    b2bStatus(d, e || undefined)
      .then((res) => {
        setStatus(res.status || "");
        if (res.status === "aprovado") {
          localStorage.setItem("construtor_cadastrado_v1", "1");
        } else {
          localStorage.removeItem("construtor_cadastrado_v1");
        }
      })
      .catch((er) => setErr(String(er?.message || er)));
  }, []);

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-2xl">
        <Link href="/construtor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
          Status <span className="text-gradient-gold">Construtor</span>
        </h1>

        <p className="mt-2 text-muted-foreground">
          Consulte a situação do seu cadastro para acessar as ofertas B2B.
        </p>

        {!doc && !email ? (
          <div className="mt-8 rounded-2xl border border-border bg-secondary p-5 text-sm text-foreground">
            Nenhum cadastro salvo. Faça seu{" "}
            <Link href="/construtor/cadastro" className="text-primary hover:underline">
              cadastro
            </Link>{" "}
            ou entre no{" "}
            <Link href="/construtor/login" className="text-primary hover:underline">
              login
            </Link>
            .
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-secondary p-6">
            {doc ? (
              <>
                <div className="text-sm text-muted-foreground">Documento</div>
                <div className="mt-1 text-lg font-bold text-foreground">{doc}</div>
              </>
            ) : null}

            {email ? (
              <>
                <div className="mt-4 text-sm text-muted-foreground">E-mail</div>
                <div className="mt-1 text-lg font-bold text-foreground">{email}</div>
              </>
            ) : null}

            {err ? (
              <div className="mt-4 text-sm text-red-400">Erro: {err}</div>
            ) : (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1 text-lg font-bold text-foreground">
                  {status || "carregando..."}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={status === "aprovado" ? "/construtor/ofertas?liberado=1" : "/construtor/ofertas"}
                className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
              >
                Ver ofertas B2B
              </Link>

              <Link
                href="/construtor/login"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-extrabold hover:bg-black/20"
              >
                Entrar novamente
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
