"use client";

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";

export default function App() {
  // 仮データを定義
  const data: ColumnType[] = [
    {
      id: "1",
      title: "Backlog 🚦",
      tasks: [
        {
          id: "111",
          title: "1",
          description: "213",
        },
        {
          id: "112",
          title: "2",
          description: "223",
        },
      ],
    },
    {
      id: "2",
      title: "In progress 🕴",
      tasks: [],
    },
    {
      id: "3",
      title: "Needs review ⛑",
      tasks: [
        {
          id: "311",
          title: "3",
          description: "233",
        },
        {
          id: "312",
          title: "4",
          description: "243",
        },
      ],
    },
    {
      id: "4",
      title: "Completed ✅",
      tasks: [],
    },
  ];
  const [columns, setColumns] = useState<ColumnType[]>(data);

  const findColumn = (unique: string | null) => {
    console.log("unique", unique);
    if (!unique) {
      return null;
    }
    // overの対象がcolumnの場合があるためそのままidを返す
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.tasks.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log("START");
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    console.log("Active column", activeColumn);
    console.log("over column", overColumn);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    setColumns((prevState) => {
      const activeItems = activeColumn.tasks;
      const overItems = overColumn.tasks;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => {
        if (c.id === activeColumn.id) {
          c.tasks = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          c.tasks = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length),
          ];
          return c;
        } else {
          return c;
        }
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("END");
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.tasks.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.tasks.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.tasks = arrayMove(overColumn.tasks, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    // 今回は長くなってしまうためsensors、collisionDetectionなどに関しての説明は省きます。
    // ひとまずは一番使われていそうなものを置いています。
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="relative flex h-full max-h-full min-h-0 min-w-[100px] overflow-x-auto">
        <div className="flex h-full max-h-full min-h-0 flex-row gap-5">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
            ></Column>
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export type ColumnType = {
  id: string;
  title: string;
  tasks: CardType[];
};

const Column: FC<ColumnType> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({ id: id });
  return (
    <div className="h-full w-[400px] overflow-hidden rounded-md bg-gray-200">
      <div className="grid h-full w-full auto-cols-min grid-flow-row grid-cols-1 grid-rows-[auto_1fr_auto] overflow-x-hidden">
        <div className="w-full flex-grow-0 bg-gray-400 p-3">
          <span className="font-semibold">{title}</span>
        </div>
        <SortableContext id={id} items={tasks} strategy={rectSortingStrategy}>
          <div
            ref={setNodeRef}
            className="relative flex w-full flex-col gap-2 overflow-x-hidden bg-red-500 p-2"
          >
            {tasks.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
              ></Card>
            ))}
          </div>
        </SortableContext>
        <div className="w-full bg-gray-400 p-3">
          <AddTaskSheet />
        </div>
      </div>
    </div>
  );
};

import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Badge } from "~/app/_components/ui/badge";
import { AddTaskSheet } from "./add-task";
export type CardType = {
  id: string;
  title: string;
  description: string;
};

const Card: FC<CardType> = ({ id, title, description }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const style = {
    border: "2px solid green",
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-full rounded-md border bg-gray-400 p-3"
    >
      <p className="font-bold">{title}</p>
      <p className="mb-2">{description}</p>
      <div className="flex flex-row gap-1">
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </div>
    </div>
  );
};

function DraggableTask({ id, title, description }: CardType) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    border: "2px solid green",
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-full rounded-md border bg-gray-400 p-3"
    >
      <p className="font-bold">{title}</p>
      <p className="mb-2">{description}</p>
      <div className="flex flex-row gap-1">
        <Badge>Badge 1</Badge>
        <Badge>Badge 2</Badge>
        <Badge>Badge 3</Badge>
      </div>
    </div>
  );
}
