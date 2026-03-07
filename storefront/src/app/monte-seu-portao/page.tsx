"use client";

import { useState } from "react";
import { calculateGateEstimate, GateType, GateModel } from "@/lib/gateCalculator";

export default function MonteSeuPortao() {
  const [type, setType] = useState<GateType>("tubular");
  const [model, setModel] = useState<GateModel>("correr");
  const [width, setWidth] = useState<number>(3);
  const [height, setHeight] = useState<number>(2);
  const [city, setCity] = useState("");

  const result = calculateGateEstimate(type, width, height);

  const modelLabel: Record<GateModel, string> = {
    correr: "Portão de correr",
    abrir: "Portão de abrir",
    basculante: "Basculante",
  };
  const typeLabel: Record<GateType, string> = {
    tubular: "Tubular",
    chapa: "Chapa",
    liso: "Liso",
  };

  const message = encodeURIComponent(
    `Olá! Quero orçamento.

Modelo: ${modelLabel[model]}
Material: ${typeLabel[type]}
Largura: ${width}m
Altura: ${height}m
Área: ${result.area}m²
Cidade: ${city || "—"}`.trim()
  );

  const whatsappUrl = `https://wa.me/5584987940211?text=${message}`;

  return (
    <div className="container pt-32 pb-16 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Monte seu portão</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Modelo</label>
          <select
            className="border rounded p-2 w-full"
            value={model}
            onChange={(e) => setModel(e.target.value as GateModel)}
          >
            <option value="correr">Portão de correr</option>
            <option value="abrir">Portão de abrir</option>
            <option value="basculante">Basculante</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Tipo</label>
          <select
            className="border rounded p-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value as GateType)}
          >
            <option value="tubular">Tubular</option>
            <option value="chapa">Chapa</option>
            <option value="liso">Liso</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Largura (m)</label>
          <input
            type="number"
            step="0.1"
            className="border rounded p-2 w-full"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Altura (m)</label>
          <input
            type="number"
            step="0.1"
            className="border rounded p-2 w-full"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Cidade</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            placeholder="Ex: Parnamirim/RN"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="bg-muted p-4 rounded">
          <p>
            Área: <b>{result.area.toFixed(2)} m²</b>
          </p>
          <p>
            Estimativa:
            <b>
              {" "}
              R$ {result.min} – R$ {result.max}
            </b>
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-yellow-400 text-black font-bold py-3 rounded"
        >
          📱 Orçar no WhatsApp
        </a>
      </div>
    </div>
  );
}

