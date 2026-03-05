"use client";

import { useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cliente_cadastro_v1";

export default function CadastroCliente() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [msg, setMsg] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!nome.trim() || !email.trim()) {
      setMsg("Preencha nome e e-mail.");
      return;
    }
    if (typeof window !== "undefined") {
      const data = { nome: nome.trim(), email: email.trim(), telefone: telefone.trim() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    setMsg("Cadastro realizado! Você pode fechar orçamentos pelo WhatsApp quando quiser.");
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <main className="container max-w-md">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block">
          ← Voltar
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
          <span className="text-gradient-gold">Cadastre-se</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Deixe seu contato para orçamentos e novidades. Sem compromisso.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="E-mail *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="tel"
            placeholder="Telefone / WhatsApp"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3.5 text-base font-bold text-primary-foreground hover:brightness-110"
          >
            Cadastrar
          </button>
        </form>

        {msg && (
          <div className="mt-4 p-4 rounded-lg border border-border bg-secondary text-sm text-foreground">
            {msg}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já cadastrado?{" "}
          <Link href="/catalogo" className="text-primary hover:underline">
            Ver catálogo
          </Link>
          {" · "}
          <a href="https://wa.me/5584987940211" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Falar no WhatsApp
          </a>
        </p>
      </main>
    </div>
  );
}
