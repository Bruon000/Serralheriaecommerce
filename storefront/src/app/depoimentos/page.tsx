import TestimonialsSection from "../../components/TestimonialsSection";

export const dynamic = "force-dynamic";

export default function DepoimentosPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-12">
        <h1 className="font-display text-4xl font-bold mb-10">
          Depoimentos <span className="text-gradient-gold">de clientes</span>
        </h1>
        <TestimonialsSection />
      </main>
    </div>
  );
}


