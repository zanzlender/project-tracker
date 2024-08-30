import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-12">
      <SignIn afterSignOutUrl={"/"} />
    </main>
  );
}
