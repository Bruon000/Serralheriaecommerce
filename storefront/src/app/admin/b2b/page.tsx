"use client";

import { useEffect, useMemo, useState } from "react";
import { b2bAdminList, b2bAdminSetStatus } from "../../../lib/b2b";

type StatusType = "pendente" | "aprovado" | "rejeitado";
type FilterType = "pendente" | "aprovado" | "rejeitado" | "todos";

type Item = {
  id: string;
  status: StatusType;
  nome?: string;
  email?: string;
  doc?: string;
  telefone?: string;
  empresa?: string;
  cidade?: string;
  created_at: string;
  updated_at: string;
};

export default function AdminB2BPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("pendente");

  const user =
    typeof window !== "undefined" ? localStorage.getItem("b2b_admin_user_v1") || "" : "";
  const pass =
    typeof window !== "undefined" ? localStorage.getItem("b2b_admin_pass_v1") || "" : "";

  async function load() {
    if (!user || !pass) {
      window.location.href = "/admin/b2b/login";
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await b2bAdminList(user, pass);
      setItems(res.items || []);
    } catch (err: any) {
      setMsg(err?.message || "Erro ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(item: Item, status: StatusType) {
    if (!item.doc) {
      setMsg("Solicitação sem documento. Não foi possível atualizar.");
      return;
    }

    const previousItems = items;
    setMsg("");
    setSavingId(item.id);

    setItems((current) =>
      current.map((x) =>
        x.id === item.id
          ? {
              ...x,
              status,
              updated_at: new Date().toISOString(),
            }
          : x
      )
    );

    try {
      await b2bAdminSetStatus(
        {
          doc: item.doc,
          status,
        },
        user,
        pass
      );

      const res = await b2bAdminList(user, pass);
      setItems(res.items || []);
    } catch (err: any) {
      setItems(previousItems);
      setMsg(
        err?.message ||
          "Erro ao atualizar status. Verifique se o backend Medusa está rodando na porta 9000."
      );
    } finally {
      setSavingId("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const base =
      filter === "todos"
        ? [...items]
        : items.filter((item) => item.status === filter);

    const statusOrder: Record<StatusType, number> = {
      pendente: 0,
      aprovado: 1,
      rejeitado: 2,
    };

    return base.sort((a, b) => {
      const byStatus = statusOrder[a.status] - statusOrder[b.status];
      if (byStatus !== 0) return byStatus;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [items, filter]);

  const counters = useMemo(
    () => ({
      pendente: items.filter((i) => i.status === "pendente").length,
      aprovado: items.filter((i) => i.status === "aprovado").length,
      rejeitado: items.filter((i) => i.status === "rejeitado").length,
      todos: items.length,
    }),
    [items]
  );

  function filterButtonClass(active: boolean) {
    return active
      ? "rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground"
      : "rounded-full border border-border bg-secondary px-4 py-2 text-sm font-bold text-foreground hover:bg-secondary/80";
  }

  function statusBadgeClass(status: StatusType) {
    if (status === "aprovado") {
      return "inline-flex rounded-full bg-green-600/20 px-3 py-1 text-xs font-extrabold text-green-400";
    }
    if (status === "rejeitado") {
      return "inline-flex rounded-full bg-red-600/20 px-3 py-1 text-xs font-extrabold text-red-400";
    }
    return "inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-extrabold text-yellow-300";
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Admin B2B - Aprovações
          </h1>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("b2b_admin_user_v1");
              localStorage.removeItem("b2b_admin_pass_v1");
              window.location.href = "/admin/b2b/login";
            }}
            className="rounded-full border border-border px-5 py-2 text-sm font-bold"
          >
            Sair
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("pendente")}
            className={filterButtonClass(filter === "pendente")}
          >
            Pendentes ({counters.pendente})
          </button>
          <button
            type="button"
            onClick={() => setFilter("aprovado")}
            className={filterButtonClass(filter === "aprovado")}
          >
            Aprovados ({counters.aprovado})
          </button>
          <button
            type="button"
            onClick={() => setFilter("rejeitado")}
            className={filterButtonClass(filter === "rejeitado")}
          >
            Rejeitados ({counters.rejeitado})
          </button>
          <button
            type="button"
            onClick={() => setFilter("todos")}
            className={filterButtonClass(filter === "todos")}
          >
            Todos ({counters.todos})
          </button>
        </div>

        {msg ? (
          <div className="mb-4 rounded-lg border border-border bg-secondary p-4 text-sm">
            {msg}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-border bg-secondary p-6">
            Carregando...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-border bg-secondary p-6">
            Nenhuma solicitação encontrada neste filtro.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const isSaving = savingId === item.id;
              return (
                <div key={item.id} className="rounded-2xl border border-border bg-secondary p-5">
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-bold">{item.nome || "Sem nome"}</div>
                      <div className="mt-2">
                        <span className={statusBadgeClass(item.status)}>
                          {isSaving ? `salvando... (${item.status})` : item.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>E-mail: {item.email || "-"}</div>
                      <div>Documento: {item.doc || "-"}</div>
                      <div>Telefone: {item.telefone || "-"}</div>
                      <div>Empresa: {item.empresa || "-"}</div>
                      <div>Cidade: {item.cidade || "-"}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.status !== "aprovado" ? (
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => changeStatus(item, "aprovado")}
                          className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                        >
                          Aprovar
                        </button>
                      ) : null}
                      {item.status !== "rejeitado" ? (
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => changeStatus(item, "rejeitado")}
                          className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                        >
                          Rejeitar
                        </button>
                      ) : null}
                      {item.status !== "pendente" ? (
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => changeStatus(item, "pendente")}
                          className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
                        >
                          Voltar p/ pendente
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
