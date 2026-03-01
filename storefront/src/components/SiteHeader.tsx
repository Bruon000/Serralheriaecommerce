export default function SiteHeader() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      padding: "12px 18px",
      borderBottom: "1px solid rgba(255,140,40,.12)",
      background: "rgba(0,0,0,.55)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{
        maxWidth: 1120,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: "space-between"
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }} data-spark="1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Serralheria Delima" style={{ height: 36, width: "auto" }} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 950 }}>Serralheria Ecommerce</div>
            <div style={{ fontSize: 12, opacity: .75 }}>Orçamento rápido • WhatsApp</div>
          </div>
        </a>

        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="steelBtn" href="/" data-spark="1">Home</a>
          <a className="steelBtn" href="/catalogo" data-spark="1">Catálogo</a>
          <a className="steelBtn" href="/carrinho" data-spark="1">Carrinho</a>
          <a className="steelBtn" href="/construtor/status" data-spark="1">Área Construtor (B2B)</a>
        </nav>
      </div>
    </header>
  );
}
