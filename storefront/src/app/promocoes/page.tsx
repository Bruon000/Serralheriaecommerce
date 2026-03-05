import { redirect } from "next/navigation";

export default function PromocoesPage() {
  redirect("/catalogo?promo=1");
}
