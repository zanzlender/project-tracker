import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { generatePattern } from "~/app/_components/generate-svg";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) return <></>;

  const projects = await api.project.getProjectsForUser();

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-6 lg:px-8">
        <div className="flex w-full flex-row items-end justify-between">
          <h1 className="text-3xl font-medium">Projects</h1>
          <Link href="/dashboard/create">
            <Button variant={"default"}>Create new project</Button>
          </Link>
        </div>

        <div className="flex w-full flex-row flex-wrap justify-start gap-10">
          {projects.length === 0 ? (
            <NoProjectsMessage />
          ) : (
            projects.map((project) => {
              return (
                <ProjectCard
                  key={`project-${project.id}`}
                  url={`/dashboard/${project.id}/overview`}
                  project={project}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

async function ProjectCard({
  url,
  project,
}: {
  url: string;
  project: Awaited<ReturnType<typeof api.project.getProjectsForUser>>[number];
}) {
  const styles = (await generatePattern({ projectId: project.id })) ?? {};

  return (
    <Link href={url}>
      <div className="flex aspect-video w-full min-w-[300px] max-w-[300px] flex-col overflow-hidden rounded-md border shadow-md transition-all duration-200 hover:scale-[102%]">
        <div className="h-24 w-full" style={styles}></div>
        <div className="relative p-4">
          <p className="overflow-x-hidden overflow-ellipsis text-lg font-semibold">
            {project.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

function NoProjectsMessage() {
  return (
    <>
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-sm border p-12 md:min-h-[400px]">
        <span className="text-center text-base">
          You haven&apos;t created any projects yet...
        </span>
      </div>
    </>
  );
}
