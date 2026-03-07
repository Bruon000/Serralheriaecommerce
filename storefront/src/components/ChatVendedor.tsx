"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  getInitialMessage,
  processMessage,
  processPhotoReceived,
  tipoToApiSlug,
  type ChatContext,
} from "@/lib/chat/chatEngine";
import { getWhatsAppLink } from "@/lib/chat/whatsapp";

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
  const [isOpen, setIsOpen] = useState(false);
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
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, catalogProducts, isOpen]);

  async function handleSendText() {
    const text = input.trim();
    if (!text) return;

    if (!isOpen) setIsOpen(true);

    setInput("");
    const userMsg: ChatMessage = { id: generateId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const response = processMessage(text, context);

    setContext(response.context);
    setShowActionButtons(response.showActionButtons ?? false);
    setShowWhatsAppOnly(response.showWhatsAppOnly ?? false);
    setShowInstagram(response.showInstagram ?? false);
    setEstimate(response.estimate ?? null);

    if (!response.showCatalog) {
      setCatalogProducts(null);
    }

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

    if (response.showInstagram && !response.showCatalog) {
      setCatalogProducts(null);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    if (!isOpen) setIsOpen(true);

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
    setIsOpen(true);
    setShowInstagram(false);
    setShowWhatsAppOnly(false);
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
    setIsOpen(false);
    setShowInstagram(false);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const ctxWithEstimate =
      estimate != null ? { ...context, min: estimate.min, max: estimate.max } : context;
    const url = getWhatsAppLink(ctxWithEstimate, baseUrl);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed left-4 bottom-20 sm:left-6 sm:bottom-32 z-[80] w-[min(92vw,340px)]">
      <div className="overflow-hidden rounded-2xl border border-neutral-700/90 bg-neutral-950/95 shadow-[0_18px_50px_rgba(0,0,0,0.48)] backdrop-blur">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-3 border-b border-neutral-700 bg-neutral-900/95 px-3 py-3 text-left transition hover:bg-neutral-900"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar Chat Delima" : "Abrir Chat Delima"}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-amber-500/30 bg-neutral-800 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_18px_rgba(0,0,0,0.35)]">
              <Image
                src="/chat-delima-mascote.png"
                alt="Mascote do Chat Delima"
                fill
                className="object-cover"
                sizes="44px"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Chat Delima</p>
              <p className="truncate text-[11px] text-neutral-400">
                {isOpen ? "Modelos, medidas e WhatsApp" : "Orçamento rápido Delima"}
              </p>
            </div>
          </div>
          <span
            className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </button>

        {!isOpen && (
          <div className="px-3 pb-3 pt-2">
            <p className="mb-2 text-xs text-neutral-400">
              Tire dúvidas, veja modelos e receba uma estimativa rápida.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-semibold text-black shadow hover:bg-amber-400 transition"
            >
              Abrir Chat Delima
            </button>
          </div>
        )}

        {isOpen && (
          <>

      <div
        ref={scrollRef}
        className="chat-body h-[360px] max-h-[52vh] overflow-y-auto p-3 space-y-3 bg-neutral-950 sm:h-[390px] sm:max-h-[58vh]"
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
              Posso: mostrar modelos, receber foto do local e finalizar no WhatsApp.
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
              className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition shadow flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span>Falar no WhatsApp</span>
            </button>
          </div>
        )}

        {showInstagram && (
          <div className="grid gap-2 mt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-yellow-500 text-black py-2 rounded font-medium"
            >
              📷 Ver modelos no Instagram
            </a>
            <button
              type="button"
              onClick={handleVerModelos}
              className="block text-center bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded font-medium border border-neutral-600"
            >
              🧱 Ver catálogo no site
            </button>
            <button
              type="button"
              onClick={handleFalarWhatsApp}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span>Falar com serralheiro</span>
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-700 bg-neutral-900 p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
            placeholder="Ex: deslizante 3x2"
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
          </>
        )}
      </div>
    </div>
  );
}
