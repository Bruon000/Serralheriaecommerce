import { getPromocaoSemana } from "../lib/medusa";
import { getDisplayPriceBRL } from "../lib/pricing";





export default async function Home() {


  const promo = await getPromocaoSemana();





  return (


    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>


      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Serralheria Ecommerce</h1>


      <p style={{ opacity: 0.75, marginBottom: 24 }}>


        Promoção da Semana (metadata.promocao = 'semana')


      </p>





      {promo.length === 0 ? (


        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>


          Nenhum produto em promoção nesta semana.


        </div>


      ) : (


        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>


          {promo.map((p) => (


            <a


              key={p.id}


              href={`/produto/${p.handle}`}


              style={{


                display: "block",


                border: "1px solid #ddd",


                borderRadius: 8,


                padding: 12,


                textDecoration: "none",


                color: "inherit",


              }}


            >


              <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
              <div style={{ marginBottom: 6, fontWeight: 700 }}>{getDisplayPriceBRL(p as any, false).text}</div>


              <div style={{ opacity: 0.7, fontSize: 12 }}>handle: {p.handle}</div>


              <div style={{ opacity: 0.7, fontSize: 12 }}>ipo: {String(p.metadata?.ipo ?? "-")}</div>


              <div style={{ opacity: 0.7, fontSize: 12 }}>tipo: {String(p.metadata?.tipo ?? "-")}</div>


            </a>


          ))}


        </div>


      )}


    </main>


  );


}







