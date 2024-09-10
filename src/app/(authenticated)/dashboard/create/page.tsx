import { Suspense } from "react";
import { CreateProjectForm } from "./_components/create-project-form";
import Loading from "./loading";

export default async function Dashboard() {
  return (
    <>
      <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col items-center justify-start gap-10 p-4">
        <h1 className="text-center text-3xl font-medium">
          Setup a new project
        </h1>

        <Suspense fallback={<Loading />}>
          <CreateProjectForm />
        </Suspense>
      </div>
    </>
  );
}
