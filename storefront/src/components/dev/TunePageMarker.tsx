"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function pageKeyFromPath(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/catalogo")) return "catalogo";
  if (path.startsWith("/carrinho")) return "carrinho";
  if (path.startsWith("/produto")) return "produto";
  if (path.startsWith("/orcamento")) return "orcamento";
  if (path.startsWith("/pedidos")) return "pedidos";
  if (path.startsWith("/promocoes")) return "promocoes";
  if (path.startsWith("/depoimentos")) return "depoimentos";
  if (path.startsWith("/construtor")) return "construtor";
  if (path.startsWith("/admin")) return "admin";
  return "outra";
}

export default function TunePageMarker() {
  const pathname = usePathname();

  useEffect(() => {
    const key = pageKeyFromPath(pathname || "/");
    document.documentElement.setAttribute("data-tune-page", key);
  }, [pathname]);

  return null;
}
