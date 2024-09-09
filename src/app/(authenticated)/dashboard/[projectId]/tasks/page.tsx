"use client";

import { api } from "~/trpc/react";
import { Suspense } from "react";
import KanbanBoard from "./_components/kanban-board";

export default function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  const columns = api.project.getTasksForProject.useQuery(
    {
      projectId: params.projectId,
    },
    {
      staleTime: 0,
    },
  );

  return (
    <>
      <div className="flex h-full max-h-full min-h-0 w-full flex-grow flex-col gap-4 overflow-hidden">
        <div className="flex h-full max-h-full min-h-0 w-full flex-col gap-6">
          <span className="text-2xl font-semibold"> Task manager</span>

          <Suspense>
            {columns.data && (
              <KanbanBoard
                projectId={params.projectId}
                columns={columns.data ?? []}
              />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
