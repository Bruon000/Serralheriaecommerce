"use client";

import { useState } from "react";
import Link from "next/link";
import { b2bStatus } from "../../../lib/b2b";

const STORAGE_EMAIL = "construtor_email_v1";
const STORAGE_SENHA = "construtor_senha_v1";
const STORAGE_DOC = "construtor_doc_v1";

export default function LoginConstrutor() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!email.trim() || !senha.trim()) {
      setMsg("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem(STORAGE_EMAIL) : null;
      const storedSenha = typeof window !== "undefined" ? localStorage.getItem(STORAGE_SENHA) : null;
      const storedDoc = typeof window !== "undefined" ? localStorage.getItem(STORAGE_DOC) || "" : "";

      if (storedEmail === email.trim() && storedSenha === senha) {
        const res = await b2bStatus(storedDoc.trim(), email.trim());

        if (res.status === "aprovado") {
          localStorage.setItem("construtor_cadastrado_v1", "1");
        } else {
          localStorage.removeItem("construtor_cadastrado_v1");
        }

        setMsg("Login feito! Redirecionando...");
        setTimeout(() => {
          window.location.href = "/construtor/status";
        }, 800);
      } else {
        setMsg("E-mail ou senha incorretos. Cadastre-se se ainda não tiver conta.");
      }
    } catch (err: any) {
      setMsg(err?.message || "Erro. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <main className="container max-w-md">
        <Link href="/construtor" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block">
          ← Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
          Entrar — Área <span className="text-gradient-gold">Construtor</span>
        </h1>

        <p className="text-muted-foreground mb-8">
          Use o e-mail e a senha do seu cadastro.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3.5 text-base font-bold text-primary-foreground hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 p-4 rounded-lg border border-border bg-secondary text-sm text-foreground">
            {msg}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tem cadastro?{" "}
          <Link href="/construtor/cadastro" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </main>
    </div>
  );
}
