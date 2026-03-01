export default function SiteHeader() {
  return (
    <div className="topbar">
      <div className="nav">
        <div className="brand">Serralheria Ecommerce</div>

        <div className="navlinks">
          <a className="pill" href="/">Home</a>
          <a className="pill" href="/catalogo">Catálogo</a>
          <a className="pill" href="/carrinho">Carrinho</a>
          <a className="pill pillPrimary" href="/construtor/status">Área Construtor (B2B)</a>
        </div>
      </div>
    </div>
  );
}
