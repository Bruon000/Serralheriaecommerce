"use client";

import { useState } from "react";

export default function AdminB2BLoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!user.trim() || !pass.trim()) {
      setMsg("Preencha usuário e senha.");
      return;
    }

    localStorage.setItem("b2b_admin_user_v1", user.trim());
    localStorage.setItem("b2b_admin_pass_v1", pass);
    window.location.href = "/admin/b2b";
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-md">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-6">
          Login Admin B2B
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3"
          />

          <input
            type="password"
            placeholder="Senha"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3.5 text-base font-bold text-primary-foreground"
          >
            Entrar
          </button>
        </form>

        {msg ? (
          <div className="mt-4 rounded-lg border border-border bg-secondary p-4 text-sm">
            {msg}
          </div>
        ) : null}
      </div>
    </main>
  );
}
