import { redirect } from "next/navigation";

export default function SeminovosPage() {
  redirect("/catalogo?seminovo=1&tipo=portao");
}
