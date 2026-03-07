"use client";

import { useEffect, useRef, useState } from "react";
import { detectTipo, detectMedidas, tipoToSlug } from "@/lib/chatParse";
import PreviewPortao from "@/components/PreviewPortao";

const PRECO_MIN = 198;
const PRECO_MAX = 264;
const WA_NUMBER = "5584987940211";

type ConversationState = {
  tipo: string | null;
  largura: number | null;
  altura: number | null;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  type?: "preview" | "products" | "whatsapp" | "photo_ack";
  data?: {
    tipo?: string;
    largura?: number;
    altura?: number;
    area?: number;
    min?: number;
    max?: number;
    products?: { id: string; title?: string | null; thumbnail?: string | null; handle?: string }[];
  };
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "bot",
    content: "Olá! Posso calcular seu portão ou mostrar alguns modelos. Digite o tipo e as medidas (ex: portão deslizante 3x2) ou faça uma pergunta.",
  },
];

function faqResponse(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("entrega")) {
    return "Sim! Fazemos entrega conforme disponibilidade da equipe. O prazo médio é de 7 a 15 dias úteis.";
  }
  if (lower.includes("instalação") || lower.includes("instalacao")) {
    return "A instalação é por conta do cliente. Nós fabricamos e fazemos a entrega.";
  }
  return null;
}

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function tipoDisplay(tipo: string): string {
  if (tipo === "deslizante") return "deslizante";
  if (tipo === "social") return "social";
  return tipo;
}

export default function AIChatVendedor() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [conversation, setConversation] = useState<ConversationState>({
    tipo: null,
    largura: null,
    altura: null,
  });
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    const hasPhoto = photo !== null;

    if (!text && !hasPhoto) return;

    setInput("");
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const userContent = hasPhoto ? (text ? `${text} [Foto anexada]` : "[Foto]") : text;
    const userMsg: Message = { id: generateId(), role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);

    if (hasPhoto) {
      const ack: Message = {
        id: generateId(),
        role: "bot",
        content:
          "Foto recebida 👍\n\nVocê sabe aproximadamente a largura e altura do portão?\n\nExemplo:\n3x2",
        type: "photo_ack",
      };
      setMessages((prev) => [...prev, ack]);
      return;
    }

    const faq = faqResponse(text);
    if (faq) {
      setMessages((prev) => [...prev, { id: generateId(), role: "bot", content: faq }]);
      return;
    }

    const tipoDetectado = detectTipo(text);
    const medidasDetectadas = detectMedidas(text);

    const conversationAtualizado: ConversationState = {
      tipo: conversation.tipo || tipoDetectado,
      largura: conversation.largura ?? medidasDetectadas?.largura ?? null,
      altura: conversation.altura ?? medidasDetectadas?.altura ?? null,
    };
    setConversation(conversationAtualizado);

    const { tipo, largura, altura } = conversationAtualizado;

    if (tipo && largura != null && altura != null && largura > 0 && altura > 0) {
      const area = largura * altura;
      const min = Math.round(area * PRECO_MIN);
      const max = Math.round(area * PRECO_MAX);

      const estimateText = `Área: ${area} m²\nEstimativa inicial:\nR$${min} — R$${max}`;
      const newBotMessages: Message[] = [
        { id: generateId(), role: "bot", content: estimateText },
        {
          id: generateId(),
          role: "bot",
          content: "Quer ver alguns modelos desse tipo?",
          type: "preview",
          data: {
            tipo: tipoDisplay(tipo),
            largura,
            altura,
            area,
            min,
            max,
          },
        },
      ];

      const slug = tipoToSlug(tipo);
      try {
        const res = await fetch(`/api/products-by-type?tipo=${encodeURIComponent(slug)}`);
        const data = await res.json();
        const products = (data.products ?? []).slice(0, 6);
        if (products.length > 0) {
          newBotMessages.push({
            id: generateId(),
            role: "bot",
            content: "",
            type: "products",
            data: { products },
          });
        }
      } catch {
        // ignore
      }

      newBotMessages.push({
        id: generateId(),
        role: "bot",
        content: "",
        type: "whatsapp",
        data: {
          tipo: tipoDisplay(tipo),
          largura,
          altura,
          area,
          min,
          max,
        },
      });

      setMessages((prev) => [...prev, ...newBotMessages]);
      return;
    }

    if (!tipo) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "bot",
          content:
            "Qual tipo de portão?\n\nExemplos:\ndeslizante\nsocial\n2 folhas",
        },
      ]);
      return;
    }

    if (largura == null || largura <= 0) {
      const slug = tipoToSlug(tipo);
      const newBotMessages: Message[] = [
        {
          id: generateId(),
          role: "bot",
          content: `Perfeito 👍 portão ${tipoDisplay(tipo)}.\n\nAgora me diga as medidas (ex: 3x2)`,
        },
      ];
      try {
        const res = await fetch(`/api/products-by-type?tipo=${encodeURIComponent(slug)}`);
        const data = await res.json();
        const products = (data.products ?? []).slice(0, 6);
        if (products.length > 0) {
          newBotMessages.push({
            id: generateId(),
            role: "bot",
            content: "",
            type: "products",
            data: { products },
          });
        }
      } catch {
        // ignore
      }
      setMessages((prev) => [...prev, ...newBotMessages]);
      return;
    }

    if (altura == null || altura <= 0) {
      const slug = tipoToSlug(tipo);
      const newBotMessages: Message[] = [
        {
          id: generateId(),
          role: "bot",
          content: "E a altura?\nExemplo: 2 metros",
        },
      ];
      try {
        const res = await fetch(`/api/products-by-type?tipo=${encodeURIComponent(slug)}`);
        const data = await res.json();
        const products = (data.products ?? []).slice(0, 6);
        if (products.length > 0) {
          newBotMessages.push({
            id: generateId(),
            role: "bot",
            content: "",
            type: "products",
            data: { products },
          });
        }
      } catch {
        // ignore
      }
      setMessages((prev) => [...prev, ...newBotMessages]);
      return;
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed left-4 bottom-20 sm:left-6 sm:bottom-28 z-50 w-full max-w-[320px] flex flex-col rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-700 flex items-center gap-2">
        <span className="text-lg" aria-hidden>👨‍🏭</span>
        <span className="font-semibold text-white text-sm">Chat Serralheiro</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-[200px] max-h-[320px] p-3 space-y-3"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-800 text-neutral-100"
              }`}
            >
              {msg.content ? <p className="whitespace-pre-wrap">{msg.content}</p> : null}
              {msg.type === "preview" && msg.data && (
                <div className="mt-2">
                  <PreviewPortao
                    tipo={msg.data.tipo ?? ""}
                    largura={String(msg.data.largura ?? "")}
                    altura={String(msg.data.altura ?? "")}
                  />
                </div>
              )}
              {msg.type === "products" && msg.data?.products && (
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {msg.data.products.map((p) => (
                    <a
                      key={p.id}
                      href={p.handle ? `/produto/${p.handle}` : "#"}
                      className="rounded overflow-hidden bg-neutral-700 block focus:ring-2 focus:ring-yellow-400"
                    >
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt={p.title ?? ""}
                          className="w-full h-14 object-cover"
                        />
                      ) : (
                        <div className="w-full h-14 bg-neutral-600 flex items-center justify-center text-neutral-400 text-xs">—</div>
                      )}
                    </a>
                  ))}
                </div>
              )}
              {msg.type === "whatsapp" && msg.data && (
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    `Olá!\n\nQuero orçamento.\n\nTipo: ${msg.data.tipo}\nLargura: ${msg.data.largura}m\nAltura: ${msg.data.altura}m\nÁrea: ${msg.data.area} m²\n\nEstimativa do site:\nR$${msg.data.min} — R$${msg.data.max}\n\nCidade: ______`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm transition"
                >
                  📱 Falar com serralheiro
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-neutral-700 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Tipo e medidas ou pergunta..."
            className="flex-1 min-w-0 rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <label className="cursor-pointer rounded-lg bg-neutral-700 hover:bg-neutral-600 p-2 flex items-center justify-center text-white" title="Enviar foto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Enviar foto"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
            <span className="text-lg" aria-hidden>📷</span>
          </label>
          <button
            type="button"
            onClick={handleSend}
            className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-2 text-sm"
          >
            Enviar
          </button>
        </div>
        {photo && (
          <p className="text-xs text-green-400">Foto anexada: {photo.name}</p>
        )}
      </div>
    </div>
  );
}
