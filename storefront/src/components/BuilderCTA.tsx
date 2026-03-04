"use client";

import Link from "next/link";

export type BuilderCTAProps = {
  text?: string;
  buttonText?: string;
  link?: string;
};

export default function BuilderCTA({
  text = "",
  buttonText = "Saiba mais",
  link = "#",
}: BuilderCTAProps) {
  const href = (link || "#").trim() || "#";
  const isExternal = href.startsWith("http");

  return (
    <div className="steel-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {text && (
        <p className="text-foreground/90 font-medium">{text}</p>
      )}
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
        >
          {buttonText}
        </a>
      ) : (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
