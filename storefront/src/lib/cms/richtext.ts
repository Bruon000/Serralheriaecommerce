/**
 * Converte JSON do TipTap para HTML (uso no servidor no Renderer).
 * Usa @tiptap/html (server build) + StarterKit.
 */
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { RichTextContent } from "./types";

const extensions = [StarterKit];

export function richTextToHtml(json: RichTextContent | null | undefined): string {
  if (!json || typeof json !== "object") return "";
  try {
    return generateHTML(json as Parameters<typeof generateHTML>[0], extensions);
  } catch {
    return "";
  }
}
