"use client";

import { useState } from "react";

function onlyDigits(s: string) {
  return (s || "").replace(/\D+/g, "");
}

export default function CadastroConstrutor() {
  const [cnpj, setCnpj] = useState("");
  const [ok, setOk] = useState(false);

  function submit() {
    const d = onlyDigits(cnpj);
    if (d.length !== 14) {
      alert("CNPJ inválido (precisa ter 14 dígitos).");
      return;
    }
    localStorage.setItem("construtor_cadastrado_v1", "1");
    setOk(true);
    alert("Cadastro B2B salvo! WhatsApp liberado (com mínimo 3 portões no carrinho).");
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <a href="/">← Home</a>
      <h1 style={{ fontSize: 28, marginTop: 12 }}>Cadastro Construtor (B2B)</h1>

      <label style={{ display: "block", marginTop: 12 }}>
        CNPJ
        <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} style={{ width: "100%" }} />
      </label>

      <button onClick={submit} style={{ marginTop: 12, padding: "10px 14px" }}>
        Cadastrar
      </button>

      {ok && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          OK! Cadastro ativo nesta máquina.
        </div>
      )}
    </main>
  );
}
