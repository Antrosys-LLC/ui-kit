import type { ReactNode } from "react";

export type KanbanPriority = "low" | "medium" | "high" | "urgent";

export interface KanbanLabel {
  id: string;
  name: string;
  color?: string; // Text / accent color (hex or CSS var)
  bg?: string;    // Background color
}

export interface KanbanAssignee {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
  role?: string;
}

export interface KanbanChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  labels?: KanbanLabel[];
  assignees?: KanbanAssignee[];
  dueDate?: string; // YYYY-MM-DD format
  priority?: KanbanPriority;
  checklist?: KanbanChecklistItem[];
  attachmentsCount?: number;
  commentsCount?: number;
  customData?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;      // Accent header color (e.g. #7C3AED, #10B981)
  wipLimit?: number;   // Work-In-Progress limit
  icon?: ReactNode;
  isLocked?: boolean;  // Prevent moving cards out or into this column
}

export interface CardMoveEvent {
  cardId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
  card: KanbanCard;
}

export interface CardTemplateProps {
  card: KanbanCard;
  isDragging: boolean;
  onOpenDetails?: () => void;
}

export interface KanbanBoardProps {
  /** Array of column definitions */
  columns: KanbanColumn[];
  /** Array of card items */
  cards: KanbanCard[];
  /** Callback fired when a card is moved between or within columns */
  onCardMove?: (event: CardMoveEvent, updatedCards: KanbanCard[]) => void;
  /** Callback when card details are updated in the modal */
  onCardUpdate?: (updatedCard: KanbanCard) => void;
  /** Callback when a new card is added */
  onCardCreate?: (newCard: KanbanCard) => void;
  /** Callback when a card is deleted */
  onCardDelete?: (cardId: string) => void;
  /** Callback when a column is created */
  onColumnCreate?: (newColumn: KanbanColumn) => void;
  /** Callback when a column is updated */
  onColumnUpdate?: (updatedColumn: KanbanColumn) => void;
  /** Callback when a column is deleted */
  onColumnDelete?: (columnId: string) => void;
  /** Custom card rendering template */
  cardTemplate?: (card: KanbanCard, isDragging: boolean) => ReactNode;
  /** Enable search and filtering toolbar */
  showToolbar?: boolean;
  /** Board title rendered in the toolbar */
  title?: ReactNode;
  /** Board description or sprint metadata */
  description?: ReactNode;
  /** Custom extra actions rendered in toolbar */
  actions?: ReactNode;
  /** Allow inline card creation directly inside columns */
  allowQuickAdd?: boolean;
  /** Allow creating new columns */
  allowAddColumn?: boolean;
  /** Read-only mode disabling drag and drop */
  readOnly?: boolean;
  /** Custom container class */
  className?: string;
  /** Theme override ('light' | 'dark') */
  theme?: "light" | "dark";
}
