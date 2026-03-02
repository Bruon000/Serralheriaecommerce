"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { loadCart } from "../lib/cart";

function countQty(items: { qty?: number }[]): number {
  return (items || []).reduce((acc, it) => acc + Number(it?.qty || 0), 0);
}

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Promoções", href: "/catalogo?promo=1" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Contato", href: "/#contato" },
  { label: "Cadastre-se", href: "/cadastro" },
  { label: "Área Construtor", href: "/construtor/login" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const refresh = () => setTotalItems(countQty(loadCart()));
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center font-display text-xl font-bold text-foreground hover:opacity-90 transition-opacity">
          <span className="text-gradient-gold">Serralheria</span>
          <span className="ml-1.5">Delima</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/carrinho"
            className="relative inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground transition-all hover:border-primary/40"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          <a
            href="https://wa.me/5584987940211"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            Orçamento
          </a>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/carrinho"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              Carrinho {totalItems > 0 && `(${totalItems})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
