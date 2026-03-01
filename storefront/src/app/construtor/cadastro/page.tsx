"use client";

import { useState } from "react";
import { b2bRegister } from "../../../lib/b2b";

export default function CadastroConstrutor() {
  const [doc, setDoc] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function submit() {
    setMsg("");
    const payload = { doc, nome, email, telefone, empresa };
    const res = await b2bRegister(payload);

    localStorage.setItem("construtor_doc_v1", doc);
    // ainda não aprova aqui — status inicial é pendente
    localStorage.removeItem("construtor_cadastrado_v1");

    setMsg("Cadastro enviado! Status: pendente. Aguarde aprovação.");
    window.location.href = "/construtor/status";
  }

  return (
    <main style={{ padding: 16 }}>
      <a href="/">← Home</a>
      <h1>Cadastro Construtor (B2B)</h1>

      <p>Envie seu cadastro. Você fica com status <b>pendente</b> até aprovação.</p>

      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Documento (CPF/CNPJ)" value={doc} onChange={(e) => setDoc(e.target.value)} />
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input placeholder="Empresa (opcional)" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
        <button onClick={() => submit()} disabled={!doc.trim()}>
          Enviar cadastro
        </button>
      </div>

      {msg && <div style={{ marginTop: 12, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>{msg}</div>}

      <p style={{ marginTop: 16 }}>
        Já cadastrou? <a href="/construtor/login">Consultar status (login)</a>
      </p>
    </main>
  );
}
