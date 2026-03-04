"use client";

export type BuilderSectionProps = {
  title?: string;
  subtitle?: string;
  content?: string;
  /** Optional: render Builder blocks as children instead of content string */
  children?: React.ReactNode;
};

export default function BuilderSection({
  title,
  subtitle,
  content,
  children,
}: BuilderSectionProps) {
  return (
    <section className="steel-card p-6 md:p-8">
      {title && (
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      )}
      {content && (
        <div className="mt-4 text-foreground/90 whitespace-pre-wrap">
          {content}
        </div>
      )}
      {children}
    </section>
  );
}
