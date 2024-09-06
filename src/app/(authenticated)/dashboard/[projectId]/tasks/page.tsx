import { api } from "~/trpc/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DndContext } from "@dnd-kit/core";
import KanbanBoard from "./_components/kanban-board";
import KanbanBoard2 from "./_components/kanban-board2";

const tasks = [
  {
    id: 1,
    name: "Name",
    description: "Description",
    url: "url12",
    author: {
      username: "User",
      image: "Image 123",
    },
    tags: ["High", "Enhancement"],
  },
];

const columns = [
  {
    id: 1,
    title: "Backlog 🚦",
    tasks: [
      {
        id: 111,
        title: "1",
        description: "213",
      },
      {
        id: 112,
        title: "2",
        description: "223",
      },
    ],
  },
  {
    id: 2,
    title: "In progress 🕴",
    tasks: [],
  },
  {
    id: 3,
    title: "Needs review ⛑",
    tasks: [
      {
        id: 311,
        title: "Promet",
        description: "233",
      },
      {
        id: 312,
        title: "Ludilo",
        description: "243",
      },
    ],
  },
  {
    id: 4,
    title: "Completed ✅",
    tasks: [
      {
        id: 411,
        title: "Osmoza",
        description: "233",
      },
      {
        id: 412,
        title: "Dioklecijan",
        description: "243",
      },
    ],
  },
];

export default async function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  /* const project = await api.project
    .getProject({
      projectId: params.projectId,
    })
    .catch(() => {
      redirect("/dashboard");
    });
 */
  return (
    <>
      <div className="flex h-full max-h-full min-h-0 w-full flex-grow flex-col gap-4 overflow-hidden">
        <div className="flex h-full max-h-full min-h-0 w-full flex-col gap-6">
          <span className="text-2xl font-semibold"> Task manager</span>

          <Suspense>
            <KanbanBoard columns={columns} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
