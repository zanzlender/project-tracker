import { Suspense } from "react";
import DeleteProjectDialog from "./_components/delete-project-dialog";
import { api, HydrateClient } from "~/trpc/server";
import { auth } from "@clerk/nextjs/server";
import MemberSettings from "./_components/member-settings";

export default async function SettingsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { userId } = auth();
  const project = await api.project.getProject({ projectId: params.projectId });
  if (!project) return <></>;

  const isCurrentUserOwner = project.authorId === userId;

  return (
    <HydrateClient>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full max-w-3xl flex-col">
          <span className="mb-10 text-2xl font-semibold">Project settings</span>

          <div className="flex w-full flex-col gap-2">
            <span className="text-xl font-semibold">Danger zone</span>

            {isCurrentUserOwner ? (
              <div className="flex w-full flex-col gap-2 rounded-md border-2 border-red-500 bg-gray-200 p-4">
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      Delete project
                    </span>
                    <span className="text-base">
                      This action will permantently delete the project
                    </span>
                  </div>
                  <Suspense fallback={"Loading..."}>
                    <DeleteProjectDialog projectId={params.projectId} />
                  </Suspense>
                </div>
                {/* <div className="h-[2px] w-full bg-gray-300"></div> */}
              </div>
            ) : (
              <div className="flex w-full flex-col gap-2 rounded-md border-2 border-red-500 bg-gray-200 p-4">
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      Leave project
                    </span>
                    <span className="text-base">
                      This action will remove you from the project
                    </span>
                  </div>
                  <Suspense fallback={"Loading..."}>
                    <MemberSettings projectId={params.projectId} />
                  </Suspense>
                </div>
                {/* <div className="h-[2px] w-full bg-gray-300"></div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
