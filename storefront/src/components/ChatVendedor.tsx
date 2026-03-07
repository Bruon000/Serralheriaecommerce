"use client";

import { useEffect, useRef, useState } from "react";
import {
  getInitialMessage,
  processMessage,
  processPhotoReceived,
  tipoToApiSlug,
  type ChatContext,
} from "@/lib/chat/chatEngine";
import { getWhatsAppLink } from "@/lib/chat/whatsapp";
import { detectIntent } from "@/lib/chat/intent";

const INSTAGRAM_URL = "https://instagram.com/serralheria_delima";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  photoUrl?: string;
};

type CatalogProduct = {
  id: string;
  title?: string | null;
  thumbnail?: string | null;
  handle?: string;
};

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatVendedor() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "0", role: "bot", content: getInitialMessage() },
  ]);
  const [context, setContext] = useState<ChatContext>({});
  const [input, setInput] = useState("");
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showWhatsAppOnly, setShowWhatsAppOnly] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, catalogProducts]);

  async function handleSendText() {
    const text = input.trim();
    if (!text) return;

    setInput("");
    const userMsg: ChatMessage = { id: generateId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const intent = detectIntent(text);

    if (intent === "modelos") {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", content: "Veja alguns modelos que já fabricamos 👇" },
      ]);
      setShowInstagram(true);
      return;
    }

    if (intent === "instagram") {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", content: "Veja nossos modelos no Instagram 👇" },
      ]);
      window.open(INSTAGRAM_URL, "_blank");
      return;
    }

    if (intent === "whatsapp") {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", content: "Vou te encaminhar para o serralheiro 👍" },
      ]);
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const url = getWhatsAppLink(context, baseUrl);
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (intent === "entrega") {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "bot", content: "Sim! Fazemos entrega. O prazo médio é de 7 a 15 dias úteis." },
      ]);
      return;
    }

    const response = processMessage(text, context);

    setContext(response.context);
    setShowActionButtons(response.showActionButtons ?? false);
    setShowWhatsAppOnly(response.showWhatsAppOnly ?? false);
    setShowInstagram(response.showInstagram ?? false);
    if (response.estimate) setEstimate(response.estimate);

    const botMsg: ChatMessage = {
      id: generateId(),
      role: "bot",
      content: response.message,
    };
    setMessages((prev) => [...prev, botMsg]);

    if (response.showCatalog && response.context?.tipo) {
      try {
        const slug = tipoToApiSlug(response.context.tipo);
        const res = await fetch(`/api/products-by-type?tipo=${encodeURIComponent(slug)}`);
        const json = await res.json();
        setCatalogProducts(json.products || []);
      } catch {
        setCatalogProducts(null);
      }
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const userMsg: ChatMessage = { id: generateId(), role: "user", content: "[Foto]" };
    setMessages((prev) => [...prev, userMsg]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/chat-upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const photoUrl = data.url as string;
      const response = processPhotoReceived(context, photoUrl);

      setContext(response.context);
      const botMsg: ChatMessage = {
        id: generateId(),
        role: "bot",
        content: response.message,
        photoUrl,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "bot",
          content: "Não consegui enviar a foto. Tente novamente ou fale no WhatsApp.",
        },
      ]);
    }

    e.target.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleVerModelos() {
    if (!context.tipo) return;
    setShowActionButtons(false);
    const slug = tipoToApiSlug(context.tipo);
    fetch(`/api/products-by-type?tipo=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        const products = (data.products ?? []).slice(0, 6) as CatalogProduct[];
        setCatalogProducts(products);
        if (products.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: "bot",
              content:
                "Não consegui buscar o catálogo agora. Posso enviar alguns modelos direto no WhatsApp.",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { id: generateId(), role: "bot", content: "Alguns modelos desse tipo:" },
          ]);
        }
      })
      .catch(() => {
        setCatalogProducts(null);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "bot",
            content:
              "Não consegui buscar o catálogo agora. Posso enviar alguns modelos direto no WhatsApp.",
          },
        ]);
      });
  }

  function handleFalarWhatsApp() {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const ctxWithEstimate =
      estimate != null ? { ...context, min: estimate.min, max: estimate.max } : context;
    const url = getWhatsAppLink(ctxWithEstimate, baseUrl);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed left-4 bottom-20 sm:left-6 sm:bottom-28 w-[320px] z-[80] flex flex-col rounded-xl border border-neutral-600 bg-neutral-900 shadow-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-700 flex items-center gap-2 bg-neutral-800">
        <span className="text-xl" aria-hidden>👨‍🏭</span>
        <span className="font-semibold text-white text-sm">Chat Serralheiro</span>
      </div>

      <div
        ref={scrollRef}
        className="chat-body h-[420px] max-h-[60vh] overflow-y-auto p-3 space-y-3 bg-neutral-900"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-md ${
                msg.role === "user"
                  ? "bg-amber-500 text-black"
                  : "bg-neutral-800 text-neutral-100 border border-neutral-600"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.photoUrl && msg.role === "bot" && (
                <a
                  href={msg.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 rounded overflow-hidden border border-neutral-600"
                >
                  <img
                    src={msg.photoUrl}
                    alt="Enviada pelo cliente"
                    className="w-full max-w-[200px] h-auto"
                  />
                </a>
              )}
            </div>
          </div>
        ))}

        {catalogProducts && catalogProducts.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {catalogProducts.map((p) => (
              <a
                key={p.id}
                href={p.handle ? `/produto/${p.handle}` : "#"}
                className="rounded-lg overflow-hidden bg-neutral-800 border border-neutral-600 block hover:border-amber-500/50 transition shadow"
              >
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={p.title ?? ""}
                    className="w-full h-20 object-cover"
                  />
                ) : (
                  <div className="w-full h-20 bg-neutral-700 flex items-center justify-center text-neutral-500 text-xs">
                    —
                  </div>
                )}
                <p className="p-1.5 text-xs text-neutral-300 line-clamp-2">{p.title ?? "Produto"}</p>
              </a>
            ))}
          </div>
        )}

        {showActionButtons && (
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs text-neutral-400">
              Posso: mostrar modelos, receber foto do local, enviar orçamento no WhatsApp.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleVerModelos}
                className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium border border-neutral-600 transition"
              >
                Ver modelos
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium border border-neutral-600 transition"
              >
                Enviar foto
              </button>
              <button
                type="button"
                onClick={handleFalarWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold border border-amber-600 transition shadow"
              >
                Falar no WhatsApp
              </button>
            </div>
          </div>
        )}

        {showWhatsAppOnly && (
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFalarWhatsApp}
              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition shadow"
            >
              📱 Falar no WhatsApp
            </button>
          </div>
        )}

        {showInstagram && (
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-center bg-yellow-500 text-black py-2 rounded"
          >
            📷 Ver modelos no Instagram
          </a>
        )}
      </div>

      <div className="p-2 border-t border-neutral-700 bg-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
            placeholder="Digite tipo e medidas (ex: deslizante 3x2)"
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded bg-zinc-800 border border-zinc-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <label className="cursor-pointer rounded-lg bg-neutral-700 hover:bg-neutral-600 p-2 flex items-center justify-center text-white transition">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Enviar foto"
              onChange={handleFileSelect}
            />
            <span className="text-lg" aria-hidden>📷</span>
          </label>
          <button
            type="button"
            onClick={handleSendText}
            className="rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3 py-2 text-sm transition shadow"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
