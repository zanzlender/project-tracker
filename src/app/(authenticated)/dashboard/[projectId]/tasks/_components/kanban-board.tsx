"use client";

import {
  useDroppable,
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Column = {
  id: string | number;
  title: string;
  tasks: typeof tasks;
};
const tasks = [
  {
    id: 1,
    title: "1",
    description: "213",
  },
  {
    id: 2,
    title: "2",
    description: "223",
  },
  {
    id: 3,
    title: "3",
    description: "233",
  },
  {
    id: 4,
    title: "4",
    description: "243",
  },
];

export default function KanbanBoard({ columns }: { columns: Column[] }) {
  const [_columns, setColumns] = useState(() => columns);
  const [activeId, setActiveId] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.tasks.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find(
      (i) => i.itemId.toString() === id,
    )?.columnId;

    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log("START");
    setActiveId(true);
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
      const activeIndex = activeItems.findIndex(
        (i) => i.id.toString() === activeId,
      );
      const overIndex = overItems.findIndex((i) => i.id.toString() === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => {
        if (c.id === activeColumn.id) {
          console.log("task", c.id);

          c.tasks = activeItems.filter((i) => i.id.toString() !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          const tasksBefore = overItems.slice(0, newIndex());
          const tasksAfter = overItems.slice(newIndex(), overItems.length);
          const task = activeItems[activeIndex];

          if (!task) return c;

          c.tasks = [...tasksBefore, task, ...tasksAfter];
          return c;
        } else {
          return c;
        }
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("END");
    setActiveId(false);
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.tasks.findIndex(
      (i) => i.id.toString() === activeId,
    );
    const overIndex = overColumn.tasks.findIndex(
      (i) => i.id.toString() === overId,
    );
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        const x = prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.tasks = arrayMove(overColumn.tasks, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
        console.log("X", x);
        return x;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="relative flex h-full max-h-full min-h-0 min-w-[100px] overflow-x-auto">
        <div className="flex h-full max-h-full min-h-0 flex-row gap-5">
          {_columns.map((column) => {
            return (
              <KanbanColumn
                key={`column-${column.id}`}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
              />
            );
          })}
        </div>

        {/*  <DragOverlay>
          {activeId ? (
            <DraggableTask
              value={111}
              id={111}
              description={"idc"}
              title="213"
            />
          ) : null}
        </DragOverlay> */}
      </div>
    </DndContext>
  );
}

function KanbanColumn(props: Column) {
  const { setNodeRef } = useDroppable({ id: props.id });

  return (
    <div className="h-full w-[400px] overflow-hidden rounded-md bg-gray-200">
      <div className="grid h-full w-full auto-cols-min grid-flow-row grid-cols-1 grid-rows-[auto_1fr_auto] overflow-x-hidden">
        <div className="w-full flex-grow-0 bg-gray-400 p-3">
          <span className="font-semibold">{props.title}</span>
        </div>
        <SortableContext
          id={String(props.id)}
          items={props.tasks.map((x) => x.id)}
          strategy={rectSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className="relative flex w-full flex-col gap-2 overflow-x-hidden bg-red-500 p-2"
          >
            {props.tasks.map((task) => {
              return (
                <DraggableTask
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                />
              );
            })}
          </div>
        </SortableContext>

        <div className="w-full bg-gray-400 p-3">
          <AddTaskSheet />
        </div>
      </div>
    </div>
  );
}

import { Badge } from "~/app/_components/ui/badge";
import { AddTaskSheet } from "./add-task";

export function DraggableTask({
  id,
  title,
  description,
}: (typeof tasks)[number]) {
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
}
