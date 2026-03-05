"use client";

import { useEffect, useState } from "react";
import CmsEditor from "@/components/cms/CmsEditor";

type PageRow = {
  id: string;
  urlPath: string;
  title: string | null;
  contentJson: string | null;
  published: boolean;
  updatedAt: string;
};

export default function AdminHomePage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPages() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/pages");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setPages(data.pages ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  async function logout() {
    await fetch("/api/cms/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <main className="container max-w-[1600px]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-4xl font-extrabold">CMS Admin — Page Builder</h1>
          <button
            onClick={logout}
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-extrabold bg-secondary hover:bg-secondary/80"
          >
            Sair
          </button>
        </div>
        <CmsEditor initialPages={pages} />
      </main>
    </div>
  );
}


