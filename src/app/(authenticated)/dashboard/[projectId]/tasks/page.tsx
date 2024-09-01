import { api } from "~/trpc/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

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
      <div className="flex w-full flex-grow flex-col gap-4">
        <div className="flex w-full flex-col gap-6">
          <span className="text-2xl font-semibold"> Task manager</span>

          <div className="relative flex h-[500px] min-w-[100px] overflow-x-auto bg-red-500">
            <div className="flex h-auto min-h-[500px] shrink-0 flex-row gap-3 bg-red-500">
              <div className="h-full min-h-[500px] w-[300px] overflow-hidden rounded-md bg-blue-400">
                <div className="w-full bg-gray-400 p-3">
                  <span>Backlog</span>
                </div>
              </div>
              <div className="h-full min-h-[500px] w-[300px] overflow-hidden rounded-md bg-blue-400">
                <div className="w-full bg-gray-400 p-3">
                  <span>Backlog</span>
                </div>
              </div>
              <div className="h-full min-h-[500px] w-[300px] overflow-hidden rounded-md bg-blue-400">
                <div className="w-full bg-gray-400 p-3">
                  <span>Backlog</span>
                </div>
              </div>
              <div className="h-full min-h-[500px] w-[300px] overflow-hidden rounded-md bg-blue-400">
                <div className="w-full bg-gray-400 p-3">
                  <span>Backlog</span>
                </div>
              </div>
              <div className="h-full min-h-[500px] w-[300px] overflow-hidden rounded-md bg-blue-400">
                <div className="w-full bg-gray-400 p-3">
                  <span>Backlog</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
