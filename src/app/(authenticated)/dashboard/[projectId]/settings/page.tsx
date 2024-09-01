import { Suspense } from "react";
import DeleteProjectDialog from "./_components/delete-project-dialog";

export default async function SettingsPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full max-w-3xl flex-col">
          <span className="mb-10 text-2xl font-semibold">Project settings</span>

          <div className="flex w-full flex-col gap-2">
            <span className="text-xl font-semibold">Danger zone</span>

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
                <Suspense>
                  <DeleteProjectDialog projectId={params.projectId} />
                </Suspense>
              </div>
              {/* <div className="h-[2px] w-full bg-gray-300"></div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
