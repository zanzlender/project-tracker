export default async function ProjectPaged({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <>
      <div>My Post: {params.projectId}</div>
    </>
  );
}
