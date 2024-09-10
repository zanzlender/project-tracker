import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import KanbanBoard from "./_components/kanban-board";
import { UpdateTaskSheet } from "./_components/update-task";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  const columns = await api.project.getTasksForProject({
    projectId: params.projectId,
  });

  return (
    <HydrateClient>
      <div className="flex h-full max-h-full min-h-0 w-full flex-grow flex-col gap-4 overflow-hidden px-2 py-6 pr-0 lg:px-8">
        <div className="flex h-full max-h-full min-h-0 w-full flex-col gap-6">
          <span className="text-2xl font-semibold"> Task manager</span>

          <Suspense>
            <KanbanBoard projectId={params.projectId} columns={columns} />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
