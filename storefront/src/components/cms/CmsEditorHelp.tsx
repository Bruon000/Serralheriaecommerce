"use client";

import React, { useState } from "react";

const HELP_ITEMS = [
  { q: "Como escolher página?", a: "Use os botões de rotas (Home, Catálogo, etc.) ou o dropdown 'carregar página existente'. Digite a URL no campo para criar uma nova." },
  { q: "Como adicionar bloco?", a: "No painel esquerdo, use '+ Adicionar bloco' e escolha o tipo (Section, CTA, Grid, etc.)." },
  { q: "Como arrastar e reordenar?", a: "Use o ícone de grade ao lado de cada bloco na lista e arraste para cima/baixo para mudar a ordem." },
  { q: "Como editar propriedades?", a: "Clique em um bloco na lista à esquerda. O painel à direita mostra título, textos, layout e botões rápidos (centralizar, colunas)." },
  { q: "Salvar vs Publicar?", a: "Salvar grava o rascunho (só você vê em preview). Publicar copia o rascunho para a versão ao vivo; em produção só o conteúdo publicado é exibido." },
  { q: "Como ver o preview?", a: "O centro do editor é um iframe com a página real. Qualquer alteração nos blocos atualiza o preview na hora, sem precisar salvar." },
];

export default function CmsEditorHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="steel-card p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-extrabold text-foreground/90"
        aria-expanded={open}
      >
        <span className="rounded-full bg-primary/20 p-1.5 text-primary" aria-hidden>?</span>
        Ajuda — Page Builder
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          {HELP_ITEMS.map((item) => (
            <li key={item.q}>
              <strong className="text-foreground/80">{item.q}</strong>
              <p className="mt-0.5 pl-0">{item.a}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
