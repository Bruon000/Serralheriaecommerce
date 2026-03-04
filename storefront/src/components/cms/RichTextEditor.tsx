"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { RichTextContent } from "@/lib/cms/types";

type Props = {
  value: RichTextContent;
  onChange: (json: RichTextContent) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({ value, onChange, placeholder, className = "" }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? undefined,
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] rounded-xl border border-border/50 bg-black/35 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 prose prose-invert prose-sm max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json as RichTextContent);
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
      {placeholder && (
        <div className="pointer-events-none absolute inset-0 text-muted-foreground/50 text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );
}
