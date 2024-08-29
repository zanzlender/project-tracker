import Link from "next/link";
import { Button } from "~/app/_components/ui/button";

export default async function Dashboard() {
  return (
    <>
      <div className="flex w-full flex-row items-end justify-between">
        <h1 className="text-3xl font-medium">Projects</h1>

        <Link href="/dashboard/create">
          <Button variant={"default"}>Create new project</Button>
        </Link>
      </div>
    </>
  );
}
