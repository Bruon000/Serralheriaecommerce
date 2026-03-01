import { getPromocaoSemana, getOfertasConstrutor, listProducts } from "../lib/medusa";
import { getTheme } from "../lib/theme";


import { getDisplayPriceBRL } from "../lib/pricing";





export const dynamic = "force-dynamic";





function ProductCard({ p, badge }: { p: any; badge?: string }) {


  const price = getDisplayPriceBRL(p as any, false).text;





  return (


    <a className="card" href={`/produto/${p.handle}`}>


      {p.thumbnail ? (


        // eslint-disable-next-line @next/next/no-img-element


        <img className="thumb" src={p.thumbnail} alt={p.title} />


      ) : (


        <div className="thumb" style={{ display: "grid", placeItems: "center", opacity: 0.6 }}>


          sem imagem


        </div>


      )}





      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>


        <div className="cardTitle" style={{ flex: 1 }}>{p.title}</div>


        {badge && <span className="badge">{badge}</span>}


      </div>





      <div className="price">{price}</div>





      <div className="meta">


        ipo: {String(p.metadata?.ipo ?? "-")} | tipo: {String(p.metadata?.tipo ?? "-")}


      </div>





      <div style={{ marginTop: 10, fontWeight: 900, fontSize: 13 }}>Ver detalhes →</div>


    </a>


  );


}





export default async function Home() {


    const theme = getTheme(new Date());


const promo = await getPromocaoSemana();


  const ofertasB2B = await getOfertasConstrutor();


  const all = await listProducts();





  const destaques =


    (all || []).filter((p: any) => String(p?.metadata?.tipo || "").toLowerCase() === "portao").slice(0, 8) ||


    (all || []).slice(0, 8);





  return (


    <main className="container">


      <div className="hero">


        <h1>{theme.heroTitle || "Seu projeto em metal, do jeito certo."}</h1>


        <p>{theme.heroSubtitle || "Escolha o modelo, configure medidas e finalize pelo WhatsApp."}</p>





        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>


          <a className="pill pillPrimary" href="/catalogo">{theme.ctaPrimary || "Ver catálogo"}</a>


          <a className="pill" href="/carrinho">{theme.ctaSecondary || "Ir para o carrinho"}</a>


          <a className="pill" href="/construtor/login">{theme.ctaTertiary || "Sou construtor (B2B)"}</a>


        </div>


      </div>





      <section className="sectionTitle">


        <h2>Promoção da Semana</h2>


        <span>metadata.promocao = "semana"</span>


      </section>





      {promo.length === 0 ? (


        <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "#fff" }}>


          Nenhum produto em promoção nesta semana.


        </div>


      ) : (


        <div className="grid">


          {promo.slice(0, 8).map((p) => (


            <ProductCard key={p.id} p={p} badge="PROMO" />


          ))}


        </div>


      )}





      <section className="sectionTitle">


        <h2>Ofertas para Construtores (B2B)</h2>


        <span>metadata.oferta = "construtor"</span>


      </section>





      <div style={{ marginTop: 10, opacity: 0.82 }}>


        <a href="/construtor/status">Ver meu status</a> · <a href="/construtor/ofertas">Ver ofertas B2B</a>


      </div>





      {ofertasB2B.length === 0 ? (


        <div style={{ marginTop: 12, padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "#fff" }}>


          <div style={{ fontWeight: 950, marginBottom: 6 }}>Nenhuma oferta B2B marcada ainda</div>


          <div style={{ opacity: 0.8 }}>


            No Admin, abra um produto e em <b>Metadata</b> adicione: <code>oferta</code> = <code>construtor</code>.


            <div style={{ marginTop: 8 }}>


              Alternativa em lote: <code>tools\ofertas-construtor.ps1</code>


            </div>


          </div>


        </div>


      ) : (


        <div className="grid">


          {ofertasB2B.slice(0, 8).map((p) => (


            <ProductCard key={p.id} p={p} badge="B2B" />


          ))}


        </div>


      )}





      <section className="sectionTitle">


        <h2>Destaques</h2>


        <span>seleção automática (tipo=portao)</span>


      </section>





      {destaques.length === 0 ? (


        <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "#fff" }}>


          Sem produtos para exibir.


        </div>


      ) : (


        <div className="grid">


          {destaques.map((p: any) => (


            <ProductCard key={p.id} p={p} />


          ))}


        </div>


      )}





      <div className="footer">


        Dica: no Admin, use <code>metadata.promocao="semana"</code> e <code>metadata.oferta="construtor"</code> para destacar produtos.


      </div>


    </main>


  );


}






