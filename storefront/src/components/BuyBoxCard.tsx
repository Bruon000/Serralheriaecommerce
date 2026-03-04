type Props = {
  title?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export default function BuyBoxCard({
  title = "Comprar / Adicionar ao carrinho",
  hint = "Quer orçamento com medidas? Use “Orçar este modelo”.",
  className = "",
  children,
}: Props) {
  return (
    <div className={`steel-card p-6 min-w-0 max-w-full ${className}`.trim()}>
      <div className="text-sm font-extrabold text-foreground/90 mb-3">{title}</div>
      {children}
      {hint && <div className="mt-4 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
