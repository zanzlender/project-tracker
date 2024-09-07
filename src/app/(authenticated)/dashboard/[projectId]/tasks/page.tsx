import { api } from "~/trpc/server";
import { Suspense } from "react";
import KanbanBoard333 from "./_components/kanban-board";

export default async function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  const columns = await api.project.getTasksForProject({
    projectId: params.projectId,
  });

  console.log(columns);

  return (
    <>
      <div className="flex h-full max-h-full min-h-0 w-full flex-grow flex-col gap-4 overflow-hidden">
        <div className="flex h-full max-h-full min-h-0 w-full flex-col gap-6">
          <span className="text-2xl font-semibold"> Task manager</span>

          <Suspense>
            <KanbanBoard333 projectId={params.projectId} columns={columns} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
