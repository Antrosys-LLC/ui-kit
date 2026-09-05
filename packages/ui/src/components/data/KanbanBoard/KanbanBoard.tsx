import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { clsx } from "clsx";

import type {
  KanbanBoardProps,
  KanbanCard as IKanbanCard,
  KanbanColumn as IKanbanColumn,
  KanbanPriority,
  CardMoveEvent,
} from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { KanbanToolbar } from "./KanbanToolbar";
import { KanbanCardModal } from "./KanbanCardModal";

export function KanbanBoard({
  columns: initialColumns,
  cards: initialCards,
  onCardMove,
  onCardUpdate,
  onCardCreate,
  onCardDelete,
  onColumnCreate,
  onColumnUpdate: _onColumnUpdate,
  onColumnDelete,
  cardTemplate,
  showToolbar = true,
  title,
  description,
  actions,
  allowQuickAdd = true,
  allowAddColumn = true,
  readOnly = false,
  className,
  theme,
}: KanbanBoardProps) {
  // ── States ──────────────────────────────────────────────────────────────────
  const [columns, setColumns] = useState<IKanbanColumn[]>(initialColumns);
  const [cards, setCards] = useState<IKanbanCard[]>(initialCards);
  const [activeCard, setActiveCard] = useState<IKanbanCard | null>(null);
  const [selectedCardForModal, setSelectedCardForModal] = useState<IKanbanCard | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<KanbanPriority | "all">("all");
  const [selectedLabel, setSelectedLabel] = useState<string | "all">("all");

  // Keep internal state in sync with props when they change
  React.useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  React.useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // ── Sensors for Drag & Drop ─────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // 4px movement before drag initiates, allowing clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Filtered Cards ──────────────────────────────────────────────────────────
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(q);
        const matchesDesc = card.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority match
      if (selectedPriority !== "all" && card.priority !== selectedPriority) {
        return false;
      }

      // Label match
      if (selectedLabel !== "all") {
        const hasLabel = card.labels?.some((lbl) => lbl.name === selectedLabel);
        if (!hasLabel) return false;
      }

      return true;
    });
  }, [cards, searchQuery, selectedPriority, selectedLabel]);

  // Extract unique labels for toolbar filter
  const availableLabels = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    cards.forEach((c) => {
      c.labels?.forEach((l) => {
        if (!map.has(l.name)) {
          map.set(l.name, { id: l.id, name: l.name });
        }
      });
    });
    return Array.from(map.values());
  }, [cards]);

  // ── Group Cards by Column ───────────────────────────────────────────────────
  const cardsByColumn = useMemo(() => {
    const map: Record<string, IKanbanCard[]> = {};
    columns.forEach((col) => {
      map[col.id] = [];
    });
    filteredCards.forEach((card) => {
      if (map[card.columnId]) {
        map[card.columnId].push(card);
      }
    });
    return map;
  }, [columns, filteredCards]);

  // ── Drag Handlers ───────────────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => {
    if (readOnly) return;
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (readOnly) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeCardItem = cards.find((c) => c.id === activeId);
    if (!activeCardItem) return;

    // Is over a column or another card?
    const isOverAColumn = columns.some((col) => col.id === overId);
    const overCardItem = cards.find((c) => c.id === overId);

    // Dropping over a different column
    if (isOverAColumn) {
      const targetColumnId = String(overId);
      if (activeCardItem.columnId !== targetColumnId) {
        setCards((prev) => {
          return prev.map((c) =>
            c.id === activeId ? { ...c, columnId: targetColumnId } : c
          );
        });
      }
    } else if (overCardItem) {
      // Dropping over a card in a different column
      if (activeCardItem.columnId !== overCardItem.columnId) {
        setCards((prev) => {
          const activeIndex = prev.findIndex((c) => c.id === activeId);
          const overIndex = prev.findIndex((c) => c.id === overId);

          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            columnId: overCardItem.columnId,
          };
          return arrayMove(updated, activeIndex, overIndex);
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) return;
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceCard = cards.find((c) => c.id === activeId);
    if (!sourceCard) return;

    const sourceColumnId = sourceCard.columnId;
    let destinationColumnId = sourceColumnId;

    const isOverAColumn = columns.some((col) => col.id === overId);
    const overCard = cards.find((c) => c.id === overId);

    if (isOverAColumn) {
      destinationColumnId = String(overId);
    } else if (overCard) {
      destinationColumnId = overCard.columnId;
    }

    const sourceIndex = cards.findIndex((c) => c.id === activeId);
    const destinationIndex = isOverAColumn
      ? cards.filter((c) => c.columnId === destinationColumnId).length - 1
      : cards.findIndex((c) => c.id === overId);

    let updatedCards = [...cards];
    if (sourceIndex !== destinationIndex && destinationIndex >= 0) {
      updatedCards = arrayMove(cards, sourceIndex, destinationIndex);
    }

    updatedCards = updatedCards.map((c) =>
      c.id === activeId ? { ...c, columnId: destinationColumnId } : c
    );

    setCards(updatedCards);

    const moveEvent: CardMoveEvent = {
      cardId: String(activeId),
      sourceColumnId,
      destinationColumnId,
      sourceIndex,
      destinationIndex: Math.max(0, destinationIndex),
      card: { ...sourceCard, columnId: destinationColumnId },
    };

    onCardMove?.(moveEvent, updatedCards);
  };

  // ── Card & Column Actions ───────────────────────────────────────────────────
  const handleAddCard = (columnId: string, cardTitle: string, priority: KanbanPriority) => {
    const newCard: IKanbanCard = {
      id: `card-${Date.now()}`,
      columnId,
      title: cardTitle,
      priority,
      checklist: [],
    };
    const updated = [...cards, newCard];
    setCards(updated);
    onCardCreate?.(newCard);
  };

  const handleSaveCardModal = (updatedCard: IKanbanCard) => {
    const updated = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    setCards(updated);
    onCardUpdate?.(updatedCard);
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId);
    setCards(updated);
    onCardDelete?.(cardId);
  };

  const handleAddColumn = (colTitle: string, color: string, wipLimit?: number) => {
    const newCol: IKanbanColumn = {
      id: `col-${Date.now()}`,
      title: colTitle,
      color,
      wipLimit,
    };
    const updated = [...columns, newCol];
    setColumns(updated);
    onColumnCreate?.(newCol);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (confirm("Delete this column and its associated tasks?")) {
      const updatedCols = columns.filter((c) => c.id !== columnId);
      const updatedCards = cards.filter((c) => c.columnId !== columnId);
      setColumns(updatedCols);
      setCards(updatedCards);
      onColumnDelete?.(columnId);
    }
  };

  return (
    <div
      data-theme={theme}
      className={clsx(
        "flex flex-col w-full rounded-2xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] shadow-xs transition-colors duration-200 overflow-hidden",
        className
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <KanbanToolbar
          title={title}
          description={description}
          actions={actions}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedLabel={selectedLabel}
          onLabelChange={setSelectedLabel}
          availableLabels={availableLabels}
          totalCards={filteredCards.length}
          columnsCount={columns.length}
          allowAddColumn={allowAddColumn && !readOnly}
          onAddColumn={handleAddColumn}
        />
      )}

      {/* Kanban Columns Horizontal Scroll View */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row gap-4 p-4 sm:p-6 overflow-x-auto min-h-[500px] scroll-smooth">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={cardsByColumn[col.id] || []}
              onOpenDetails={(c) => setSelectedCardForModal(c)}
              onAddCard={handleAddCard}
              onDeleteColumn={allowAddColumn && !readOnly ? handleDeleteColumn : undefined}
              cardTemplate={cardTemplate}
              allowQuickAdd={allowQuickAdd && !readOnly}
              readOnly={readOnly}
            />
          ))}

          {/* New Column Quick Action Card */}
          {allowAddColumn && !readOnly && (
            <div
              onClick={() => {
                const name = prompt("Enter new column name:");
                if (name && name.trim()) {
                  handleAddColumn(name.trim(), "#7C3AED");
                }
              }}
              className="flex flex-col items-center justify-center flex-shrink-0 w-80 h-32 rounded-2xl border-2 border-dashed border-[var(--ant-color-surface-border)] text-xs font-semibold text-[var(--ant-color-surface-text-sub)] hover:border-[var(--ant-color-brand-primary)] hover:text-[var(--ant-color-brand-primary)] hover:bg-[var(--ant-color-brand-primary-lt)]/10 cursor-pointer transition"
            >
              <span className="text-xl mb-1">+</span>
              <span>Add Column</span>
            </div>
          )}
        </div>

        {/* Drag Overlay for active card */}
        <DragOverlay>
          {activeCard ? (
            <KanbanCard
              card={activeCard}
              isOverlay
              cardTemplate={cardTemplate}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Card Details Modal */}
      <KanbanCardModal
        card={selectedCardForModal}
        columns={columns}
        isOpen={Boolean(selectedCardForModal)}
        onClose={() => setSelectedCardForModal(null)}
        onSave={handleSaveCardModal}
        onDelete={!readOnly ? handleDeleteCard : undefined}
      />
    </div>
  );
}
