# Instruções para IA — Serralheria Ecommerce

**Objetivo:** Qualquer IA (ou pessoa) que for continuar este projeto deve ler este arquivo primeiro. O repositório no GitHub é a fonte da verdade: o estado do projeto e o que falta fazer estão nos arquivos abaixo.

---

## 1. Onde saber o que fazer e onde estamos

| Arquivo | Uso |
|--------|-----|
| **CHECKLIST.md** | Lista de tarefas (fases 0–6 + "Para o site ficar interessante"). **É a fonte da verdade.** Itens com `- [ ]` = a fazer; `- [x]` = concluído. |
| **CONTINUE_PROMPT.md** | Contexto do projeto, o que já existe, e a seção **"Onde paramos / próximo passo"** — ou seja, de onde continuar. |

**Ao começar a trabalhar:** leia sempre **CHECKLIST.md** e **CONTINUE_PROMPT.md** (na raiz do repositório) para saber o estado atual e a próxima tarefa.

---

## 2. Como a IA deve trabalhar

**Importante:** Quem atualiza o checklist é **sempre a própria IA** — o usuário não marca. Ao concluir qualquer item, a IA **deve** editar o CHECKLIST.md e marcar `[x]`. Isso é **obrigatório**.

1. **Ler** `CHECKLIST.md` e `CONTINUE_PROMPT.md`.
2. **Escolher** o próximo item não marcado do checklist (ou o que estiver em "Onde paramos / próximo passo" no CONTINUE_PROMPT).
3. **Fazer** a tarefa (código, scripts, configuração). Tudo via **PowerShell** quando for rodar comandos (ambiente Windows).
4. **OBRIGATÓRIO — Atualizar o checklist:** ao concluir um ou mais itens, a IA **deve** editar o arquivo `CHECKLIST.md` e trocar `- [ ]` por `- [x]` nos itens concluídos. O usuário não marca; a IA marca.
5. **Atualizar o contexto:** editar `CONTINUE_PROMPT.md`, seção **"Onde paramos / próximo passo"**, com o que foi feito e qual é o próximo passo sugerido.
6. **(Opcional)** Rodar `.\tools\update-project.ps1` na raiz do projeto para atualizar data/commit e dar commit (se o ambiente tiver git configurado).

Assim, na próxima vez que alguém (ou outra IA) abrir o repositório — inclusive pelo link do GitHub —, basta ler `CHECKLIST.md` e `CONTINUE_PROMPT.md` para saber **onde estamos** e **o que tem que ser feito**.

---

## 3. O checklist vai para o GitHub?

Sim. O **CHECKLIST.md** fica no repositório. Quando você (ou a IA) der **commit** e **push**, o estado dos checkboxes e do **CONTINUE_PROMPT.md** sobe para o GitHub. Quem clonar ou abrir o repo no GitHub vê sempre o estado atual.

- **Marcar concluído:** no CHECKLIST.md, mudar `- [ ]` para `- [x]`.
- **Commit:** incluir CHECKLIST.md (e CONTINUE_PROMPT.md se alterou) no commit.
- **Push:** enviar para o GitHub. O checklist atualizado estará no GitHub.

---

## 4. Regras rápidas (já usadas no projeto)

- **PowerShell (Windows)** para comandos; evitar "editar manualmente" em instruções.
- Ao parar o trabalho, rodar: `pwsh -NoProfile -ExecutionPolicy Bypass -File .\tools\stop.ps1`
- Não usar `$pid` em scripts (conflita com variável do PowerShell).
- **Stack:** Backend Medusa (Admin: http://localhost:9000/app), Frontend Next.js (http://localhost:3000), Docker para Postgres/Redis. Subir com `docker compose up -d` e `npm run dev`.

---

## 5. Resumo para colar na IA

Se você só puder passar um texto curto para outra IA, use algo como:

> "Continue o projeto. Na raiz do repositório leia **AGENTS.md**, depois **CHECKLIST.md** e **CONTINUE_PROMPT.md**. Você (a IA) deve fazer o próximo item do checklist, e **sempre que concluir um item, editar o CHECKLIST.md e marcar com [x]** — o usuário não marca, quem atualiza o checklist é a IA. Atualize também a seção 'Onde paramos' no CONTINUE_PROMPT.md."

Assim a IA sabe que **ela mesma** deve atualizar o checklist; o usuário não precisa marcar nada.
