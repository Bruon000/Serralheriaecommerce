"use client";

import { useState } from "react";
import { b2bStatus } from "../../../lib/b2b";

export default function LoginConstrutor() {
  const [doc, setDoc] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function check() {
    setMsg("");
    const res = await b2bStatus(doc);

    localStorage.setItem("construtor_doc_v1", doc);

    if (res.status === "aprovado") {
      localStorage.setItem("construtor_cadastrado_v1", "1");
      setMsg("Status: aprovado ✅");
    } else {
      localStorage.removeItem("construtor_cadastrado_v1");
      setMsg(`Status: ${res.status}`);
    }

    window.location.href = "/construtor/status";
  }

  return (
    <main style={{ padding: 16 }}>
      <a href="/">← Home</a>
      <h1>Login Construtor (B2B)</h1>

      <p>Informe seu documento para consultar o status.</p>

      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Documento (CPF/CNPJ)" value={doc} onChange={(e) => setDoc(e.target.value)} />
        <button onClick={() => check()} disabled={!doc.trim()}>
          Consultar
        </button>
      </div>

      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </main>
  );
}
