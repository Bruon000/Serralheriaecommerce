"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import CmsRenderer from "./Renderer";
import type { CmsPageContent } from "@/lib/cms/types";

export type CmsDraftMessage = {
  type: "CMS_DRAFT";
  urlPath: string;
  contentJson: string;
};

export type CmsSelectMessage = {
  type: "CMS_SELECT";
  urlPath: string;
  blockId: string;
};

type Props = {
  urlPath: string;
  initialContent: CmsPageContent | null;
};

export default function CmsPreviewReceiver({ urlPath, initialContent }: Props) {
  // hooks SEMPRE no topo
  const [content, setContent] = useState<CmsPageContent | null>(initialContent);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = event.data as CmsDraftMessage | undefined;
      if (!data || data.type !== "CMS_DRAFT" || data.urlPath !== urlPath) return;

      try {
        const parsed = JSON.parse(data.contentJson) as CmsPageContent;
        if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).blocks)) {
          setContent(parsed);
        }
      } catch {
        // ignore
      }
    },
    [urlPath]
  );

  useEffect(() => {
    setContent(initialContent);
    setSelectedId(null);
  }, [urlPath, initialContent]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const hasBlocks = useMemo(() => Boolean(content?.blocks?.length), [content]);

  if (!hasBlocks) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground text-sm">
        Nenhum conteúdo. Adicione blocos no editor.
      </div>
    );
  }

  return (
    <CmsRenderer
      content={content}
      interactive
      selectedId={selectedId}
      onSelectBlock={(id) => {
        setSelectedId(id);
        try {
          window.parent?.postMessage({ type: "CMS_SELECT", urlPath, blockId: id } satisfies CmsSelectMessage, "*");
        } catch {}
      }}
    />
  );
}
