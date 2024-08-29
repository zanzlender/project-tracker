import Link from "next/link";
import { Button } from "~/app/_components/ui/button";

const projects = [
  {
    id: "1",
    name: "project1",
  },
  {
    id: "2",
    name: "project2",
  },
  {
    id: "3",
    name: "project3",
  },
];

export default async function Dashboard() {
  return (
    <>
      <div className="flex w-full flex-col gap-10">
        <div className="flex w-full flex-row items-end justify-between">
          <h1 className="text-3xl font-medium">Projects</h1>
          <Link href="/dashboard/create">
            <Button variant={"default"}>Create new project</Button>
          </Link>
        </div>

        <div className="flex w-full flex-row flex-wrap justify-start gap-10">
          {[...projects, ...projects].map((p) => {
            return (
              <ProjectCard
                key={`project-${p.id}`}
                url={`/dashboard/projects`}
                project={p}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function ProjectCard({
  url,
  project,
}: {
  url: string;
  project: { name: string };
}) {
  return (
    <Link href={url}>
      <div className="flex aspect-video w-full min-w-[300px] max-w-[300px] flex-col rounded-md border shadow-md transition-all duration-200 hover:scale-105">
        <div className="h-24 w-full bg-red-400"></div>
        <div className="relative p-4">
          <p className="overflow-x-hidden overflow-ellipsis text-lg font-semibold">
            {project.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
