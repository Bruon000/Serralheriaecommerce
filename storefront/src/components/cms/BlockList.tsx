"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CmsBlock } from "@/lib/cms/types";
import { createBlockId } from "@/lib/cms/types";

const blockTypeLabels: Record<string, string> = {
  section: "Section",
  cta: "CTA",
  detailsCard: "Details Card",
  spacer: "Spacer",
  grid: "Grid",
  columns: "Columns",
  productGallery: "Product Gallery",
  buyBoxCard: "Buy Box",
  productHeroCard: "Product Hero",
  hero: "Hero",
};

const blockTypeDescriptions: Record<string, string> = {
  section: "Título, subtítulo e texto rico",
  cta: "Texto + botão com link",
  detailsCard: "Card com lista de itens",
  spacer: "Espaço vertical",
  grid: "Container em colunas (1–4)",
  columns: "Layout em 2–4 colunas (cada coluna com blocos)",
  productGallery: "Galeria de imagens do produto",
  buyBoxCard: "Card de compra (página produto)",
  productHeroCard: "Cabeçalho do produto",
  hero: "Hero da Home com logo, posição, rotação e CTA",
};

function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  block: CmsBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const label = blockTypeLabels[block.type] ?? block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-xl border p-3 transition ${
        isSelected
          ? "border-primary/60 bg-primary/10"
          : "border-border/40 bg-black/25 hover:border-border/60"
      } ${isDragging ? "opacity-70 shadow-lg" : ""}`}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H8v3a1 1 0 11-2 0V6H4a1 1 0 010-2h3V3a1 1 0 011-1zm8 4a1 1 0 00-1-1h-3V3a1 1 0 10-2 0v2H4a1 1 0 000 2h3v3a1 1 0 102 0V6h3a1 1 0 001-1z" />
        </svg>
      </button>
      <button
        type="button"
        className="min-w-0 flex-1 truncate text-left text-sm font-medium"
        onClick={onSelect}
      >
        {label}
      </button>
      <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-black/30 hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          title="Duplicar"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-red-400/80 hover:bg-red-500/20 hover:text-red-300"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Apagar"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

type Props = {
  blocks: CmsBlock[];
  selectedId: string | null;
  onBlocksChange: (blocks: CmsBlock[]) => void;
  onSelectBlock: (id: string | null) => void;
  onAddBlock: (type: CmsBlock["type"]) => void;
};

export default function BlockList({
  blocks,
  selectedId,
  onBlocksChange,
  onSelectBlock,
  onAddBlock,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
  };

  const handleDuplicate = (block: CmsBlock) => {
    const idx = blocks.findIndex((b) => b.id === block.id);
    if (idx === -1) return;
    const newBlock = { ...block, id: createBlockId() } as CmsBlock;
    if ("children" in newBlock && Array.isArray((newBlock as { children: CmsBlock[] }).children)) {
      (newBlock as { children: CmsBlock[] }).children = ((newBlock as { children: CmsBlock[] }).children ?? []).map(
        (c) => ({ ...c, id: createBlockId() } as CmsBlock)
      );
    }
    const next = [...blocks];
    next.splice(idx + 1, 0, newBlock);
    onBlocksChange(next);
    onSelectBlock(newBlock.id);
  };

  const handleDelete = (block: CmsBlock) => {
    const next = blocks.filter((b) => b.id !== block.id);
    onBlocksChange(next);
    if (selectedId === block.id) onSelectBlock(next[0]?.id ?? null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-foreground/90">Blocos</span>
        <div className="relative group/add">
          <select
            className="appearance-none rounded-full border border-border/60 bg-black/35 px-3 py-2 pr-8 text-xs font-extrabold"
            value=""
            onChange={(e) => {
              const v = e.target.value as CmsBlock["type"];
              if (v) onAddBlock(v);
              e.target.value = "";
            }}
            title="Escolha um bloco para adicionar à página"
          >
            <option value="">+ Adicionar bloco</option>
            {(Object.keys(blockTypeLabels) as Array<keyof typeof blockTypeLabels>).map((type) => (
              <option key={type} value={type} title={blockTypeDescriptions[type] ?? ""}>
                {blockTypeLabels[type]} — {blockTypeDescriptions[type] ?? ""}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">▼</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                isSelected={selectedId === block.id}
                onSelect={() => onSelectBlock(block.id)}
                onDuplicate={() => handleDuplicate(block)}
                onDelete={() => handleDelete(block)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum bloco. Adicione um acima.</p>
      )}
    </div>
  );
}
