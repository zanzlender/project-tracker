import { api } from "~/trpc/server";
import { UpdateProjectForm } from "./_components/update-project-form";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await api.project
    .getProject({
      projectId: params.projectId,
    })
    .catch(() => {
      redirect("/dashboard");
    });

  return (
    <>
      <div className="flex w-full flex-col gap-4 p-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <Suspense>
            <UpdateProjectForm project={project} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
