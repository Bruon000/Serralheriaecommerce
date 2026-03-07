"use client";

import { useState } from "react";
import Link from "next/link";
import { b2bRegister } from "../../../lib/b2b";

const STORAGE_EMAIL = "construtor_email_v1";
const STORAGE_SENHA = "construtor_senha_v1";
const STORAGE_DOC = "construtor_doc_v1";
const STORAGE_NOME = "construtor_nome_v1";
const STORAGE_TELEFONE = "construtor_telefone_v1";
const STORAGE_EMPRESA = "construtor_empresa_v1";
const STORAGE_CIDADE = "construtor_cidade_v1";

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

export default function CadastroConstrutor() {
  const [doc, setDoc] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cidade, setCidade] = useState("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);

  async function handleBlurDoc() {
    const digits = onlyDigits(doc);
    if (digits.length !== 14) return;

    setCnpjLoading(true);
    try {
      const res = await fetch(`/api/cnpj?cnpj=${digits}`);
      const data = await res.json();
      if (!res.ok) return;

      const nomeEmpresa = data.nome_fantasia || data.razao_social || "";
      const cidadeUf =
        data.municipio && data.uf ? `${data.municipio}/${data.uf}` : "";

      if (!empresa.trim() && nomeEmpresa) setEmpresa(nomeEmpresa);
      if (!cidade.trim() && cidadeUf) setCidade(cidadeUf);
    } catch {
    } finally {
      setCnpjLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!email.trim() || !senha.trim() || !doc.trim()) {
      setMsg("Preencha e-mail, senha e CPF/CNPJ.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {
        nome: nome.trim() || "Construtor",
        email: email.trim(),
        telefone: telefone.trim(),
        empresa: empresa.trim(),
      };

      if (doc.trim()) payload.doc = doc.trim();
      if (cidade.trim()) payload.cidade = cidade.trim();

      await b2bRegister(payload);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_EMAIL, email.trim());
        localStorage.setItem(STORAGE_SENHA, senha);
        if (doc.trim()) localStorage.setItem(STORAGE_DOC, doc.trim());
        if (nome.trim()) localStorage.setItem(STORAGE_NOME, nome.trim());
        if (telefone.trim()) localStorage.setItem(STORAGE_TELEFONE, telefone.trim());
        if (empresa.trim()) localStorage.setItem(STORAGE_EMPRESA, empresa.trim());
        if (cidade.trim()) localStorage.setItem(STORAGE_CIDADE, cidade.trim());
        localStorage.removeItem("construtor_cadastrado_v1");
      }

      setMsg("Cadastro enviado com sucesso! Agora você já pode entrar para acompanhar seu status.");
      setTimeout(() => {
        window.location.href = "/construtor/login";
      }, 900);
    } catch (err: any) {
      setMsg(err?.message || "Erro ao enviar. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = doc.trim().length > 0 && email.trim().length > 0 && senha.length >= 4;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <main className="container max-w-md">
        <Link href="/construtor" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-block">
          ← Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
          Área <span className="text-gradient-gold">Construtor</span>
        </h1>

        <p className="text-muted-foreground mb-8">
          Cadastre-se para receber condições especiais. Se quiser, informe o CNPJ para preencher alguns dados automaticamente.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome do responsável"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            placeholder="Empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="space-y-2">
            <input
              type="text"
              placeholder="CNPJ ou CPF *"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              onBlur={handleBlurDoc}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              {cnpjLoading
                ? "Consultando CNPJ..."
                : "Se informar um CNPJ válido, tentamos preencher empresa e cidade automaticamente."}
            </p>
          </div>

          <input
            type="text"
            placeholder="Cidade/UF"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
            type="password"
            placeholder="Senha (mín. 4 caracteres) *"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={4}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-full bg-primary py-3.5 text-base font-bold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 p-4 rounded-lg border border-border bg-secondary text-sm text-foreground">
            {msg}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem cadastro?{" "}
          <Link href="/construtor/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}
