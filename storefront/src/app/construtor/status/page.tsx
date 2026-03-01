"use client";

import { useEffect, useState } from "react";
import { b2bStatus } from "../../../lib/b2b";

export default function StatusConstrutor() {
  const [doc, setDoc] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const d = localStorage.getItem("construtor_doc_v1") || "";
    setDoc(d);
    if (!d) return;

    b2bStatus(d)
      .then((res) => {
        setStatus(res.status || "");
        if (res.status === "aprovado") {
          localStorage.setItem("construtor_cadastrado_v1", "1");
        } else {
          localStorage.removeItem("construtor_cadastrado_v1");
        }
      })
      .catch((e) => setErr(String(e?.message || e)));
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <a href="/">← Home</a>
      <h1>Status Construtor (B2B)</h1>

      {!doc ? (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          Nenhum documento salvo. Vá em <a href="/construtor/cadastro">Cadastro</a> ou <a href="/construtor/login">Login</a>.
        </div>
      ) : (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div><b>Documento:</b> {doc}</div>
          {err ? (
            <div style={{ marginTop: 8 }}>Erro: {err}</div>
          ) : (
            <div style={{ marginTop: 8 }}><b>Status:</b> {status || "carregando..."}</div>
          )}
          <div style={{ marginTop: 12 }}>
            <a href="/construtor/ofertas">Ver ofertas B2B</a>
          </div>
        </div>
      )}
    </main>
  );
}
