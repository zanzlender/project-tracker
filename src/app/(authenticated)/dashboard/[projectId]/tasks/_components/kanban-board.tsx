"use client";

import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type UniqueIdentifier,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Badge } from "~/app/_components/ui/badge";
import { useDebounce } from "@uidotdev/usehooks";

import { AddTaskSheet } from "./add-task";
import { api } from "~/trpc/react";
import { type KanbanColumn as Column } from "~/lib/constants";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { toast } from "sonner";

export default function KanbanBoard({
  columns,
  projectId,
}: {
  columns: Column[];
  projectId: string;
}) {
  const trpcUtils = api.useUtils();
  const [_columns, setColumns] = useState(() => columns);
  const debouncedColumns = useDebounce(_columns, 1000);
  const [activeColumnId, setActiveColumndId] =
    useState<UniqueIdentifier | null>(null);
  const activeColumn =
    activeColumnId && findValueOfItems(activeColumnId, "container");
  const [activeTaskId, setActiveTaskId] = useState<UniqueIdentifier | null>(
    null,
  );
  const activeTask = activeTaskId && findTaskObjectById(activeTaskId);

  const updateTasksMutation = api.project.updateTasks.useMutation();

  async function handleUpdateColumns(props: Column[]) {
    const allTasks = props.map((column, idx) => {
      return {
        id: column.id,
        title: column.title,
        tasks: column.tasks.map((y) => {
          return {
            id: y.id,
            title: y.title,
            description: y.description,
            badges: y.badges ?? [],
            column: column.id,
            position: idx,
          };
        }),
      };
    });
    updateTasksMutation.mutate(allTasks);
  }
  // Debounce updates columns on change
  useEffect(() => {
    handleUpdateColumns(debouncedColumns).catch((err) => {
      console.error(err);
      toast("Could not save your changes. Please try again.");
    });
  }, [debouncedColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragOverEvent) => {
    const { active } = event;
    const { id } = active;

    if (active.data.current?.type === "item") {
      setActiveTaskId(id);
    } else if (active.data.current?.type === "container") {
      setActiveColumndId(id);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.data.current?.type === "item" &&
      over?.data.current?.type === "item" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = _columns.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = _columns.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.tasks.findIndex(
        (item) => item.id === over.id,
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [..._columns];
        if (newItems[activeContainerIndex]) {
          newItems[activeContainerIndex].tasks = arrayMove(
            newItems[activeContainerIndex].tasks,
            activeitemIndex,
            overitemIndex,
          );
        }

        setColumns(newItems);
      } else {
        // In different containers
        const newItems = [..._columns];
        const removeditem = newItems[activeContainerIndex]?.tasks.splice(
          activeitemIndex,
          1,
        );
        if (removeditem?.[0]) {
          newItems[overContainerIndex]?.tasks.splice(
            overitemIndex,
            0,
            removeditem[0],
          );
        }

        setColumns(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.data.current?.type === "item" &&
      over?.data.current?.type === "container" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = _columns.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = _columns.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );

      // Remove the active item from the active container and add it to the over container
      const newItems = [..._columns];
      const removeditem = newItems[activeContainerIndex]?.tasks.splice(
        activeitemIndex,
        1,
      );
      if (removeditem?.[0]) {
        newItems[overContainerIndex]?.tasks.push(removeditem[0]);
      }
      setColumns(newItems);
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.data.current?.type === "container" &&
      over?.data.current?.type === "container" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = _columns.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = _columns.findIndex(
        (container) => container.id === over.id,
      );
      // Swap the active and over container
      let newItems = [..._columns];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setColumns(newItems);
    }

    // Handling item Sorting
    if (
      active.data.current?.type === "item" &&
      over?.data.current?.type === "item" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = _columns.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = _columns.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.tasks.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [..._columns];
        if (newItems[activeContainerIndex]) {
          newItems[activeContainerIndex].tasks = arrayMove(
            newItems[activeContainerIndex].tasks,
            activeitemIndex,
            overitemIndex,
          );
        }
        setColumns(newItems);
      } else {
        // In different containers
        const newItems = [..._columns];
        const removeditem = newItems[activeContainerIndex]?.tasks.splice(
          activeitemIndex,
          1,
        );
        if (removeditem?.[0]) {
          newItems[overContainerIndex]?.tasks.splice(
            overitemIndex,
            0,
            removeditem[0],
          );
        }
        setColumns(newItems);
      }
    }

    // Handling item dropping into Container
    if (
      active.data.current?.type === "item" &&
      over?.data.current?.type === "container" &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = _columns.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = _columns.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.tasks.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = [..._columns];
      const removeditem = newItems[activeContainerIndex]?.tasks.splice(
        activeitemIndex,
        1,
      );
      console.log("HERE2131232");
      if (removeditem?.[0]) {
        newItems[overContainerIndex]?.tasks.push(removeditem[0]);
        setColumns(newItems);
      }
    }
    setActiveTaskId(null);
    setActiveColumndId(null);
  }

  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return _columns.find((col) => col.id === id);
    }
    if (type === "item") {
      return _columns.find((col) => col.tasks.find((task) => task.id === id));
    }
  }

  function findTaskObjectById(id: UniqueIdentifier) {
    let foundTask = null;

    for (const col of _columns) {
      for (const task of col.tasks) {
        if (task.id === id) {
          foundTask = task;
          break;
        }
      }
    }
    return foundTask;
  }

  const onAddItem = (
    props: inferRouterOutputs<AppRouter>["project"]["createTask"],
  ) => {
    const newData = [..._columns];
    const containerIdx = _columns.findIndex((col) => col.id === props.column);

    if (containerIdx === -1) return;

    newData[containerIdx]?.tasks.push({
      id: props.id,
      title: props.title,
      description: props.description,
      badges: props.badges ?? [],
      authorId: props.authorId,
      column: props.column,
      author: props.author,
      projectId: props.projectId,
      position: props.position,
      createdAt: new Date(),
    });

    setColumns(newData);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="relative flex h-full max-h-full min-h-0 min-w-[100px] overflow-x-auto">
          <div className="flex h-full max-h-full min-h-0 flex-row gap-5">
            {/*   <SortableContext
              items={_columns.map((x) => x.id)}
              strategy={rectSortingStrategy}
            > */}
            {_columns.map((column) => {
              return (
                <KanbanColumn
                  onAfterCreateTask={onAddItem}
                  key={String(column.id)}
                  id={column.id}
                  tasks={column.tasks}
                  title={column.title}
                  projectId={projectId}
                />
              );
            })}
            {/* </SortableContext> */}
          </div>

          <DragOverlay adjustScale={false}>
            {/* Drag Overlay For item Item */}
            {activeTask && (
              <DraggableTask
                id={activeTask.id.toString()}
                title={activeTask.title}
                description={activeTask.description}
                badges={activeTask.badges ?? []}
              />
            )}

            {/* Drag Overlay For Container */}
            {/*  {activeColumn && (
              <KanbanColumn
                id={activeColumn.id}
                title={activeColumn.title}
                tasks={activeColumn.tasks}
              />
            )} */}
          </DragOverlay>
        </div>
      </DndContext>
    </>
  );
}

function KanbanColumn(
  props: Column & {
    projectId: string;
    onAfterCreateTask: (
      props: inferRouterOutputs<AppRouter>["project"]["createTask"],
    ) => void;
  },
) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    data: {
      type: "container",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
  };

  return (
    <div
      /*   ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes} */
      className={clsx(
        "h-full w-[400px] overflow-hidden rounded-md bg-gray-200 transition-opacity duration-200",
        isDragging && "opacity-70",
      )}
    >
      <div className="grid h-full w-full auto-cols-min grid-flow-row grid-cols-1 grid-rows-[auto_1fr_auto] overflow-x-hidden shadow-xl">
        <div className="w-full flex-grow-0 bg-indigo-300 p-3">
          <span className="font-semibold">{props.title}</span>
        </div>
        <SortableContext
          id={String(props.id)}
          items={props.tasks.map((x) => x.id)}
          strategy={rectSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className="relative flex min-h-[300px] w-full flex-col gap-2 overflow-x-hidden p-2"
          >
            {props.tasks.map((task) => {
              return (
                <DraggableTask
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  badges={task.badges ?? []}
                />
              );
            })}
          </div>
        </SortableContext>

        <div className="w-full bg-indigo-300 p-3">
          <AddTaskSheet
            onAfterCreateTask={props.onAfterCreateTask}
            column={props.id.toString()}
            projectId={props.projectId}
          />
        </div>
      </div>
    </div>
  );
}

export function DraggableTask({
  id,
  title,
  description,
  badges,
}: {
  id: string;
  title: string;
  description: string;
  badges: string[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        "z-50 w-full rounded-md border bg-gray-50 p-3 shadow-md transition-opacity duration-200",
        isDragging && "scale-[101%] opacity-50",
      )}
    >
      <div className="flex w-full flex-row justify-between gap-3">
        <div>
          <p className="font-bold">{title}</p>
          <p className="mb-2">{description}</p>
        </div>
        <div className="h-4 w-4 bg-blue-500"></div>
      </div>
      <div className="flex flex-row gap-1">
        {badges?.map((badge, idx) => {
          return <Badge key={`badge-${idx}-${badge}`}>{badge}</Badge>;
        })}
      </div>
    </div>
  );
}
