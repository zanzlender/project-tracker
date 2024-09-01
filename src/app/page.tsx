import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "./_components/ui/button";
import Image from "next/image";

export default async function Home() {
  const { userId } = auth();

  return (
    <>
      <header className="flex flex-row items-center justify-between border-b-2 border-slate-800 bg-gray-950">
        {/** DESKTOP NAVIGATION */}
        <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between gap-x-6 px-4 py-6">
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-2xl font-bold text-white md:text-3xl">
                ProjectPlanner
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            {userId ? (
              <>
                <div className="relative flex flex-row items-center justify-between gap-6">
                  <Link href="/dashboard" className="font-semibold text-white">
                    Dashboard
                  </Link>

                  <div className="relative h-10 w-10">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: {
                            width: "100%",
                            height: "100%",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <SignInButton>
                <Button
                  className="w-full min-w-min font-bold"
                  variant={"destructive"}
                >
                  Login
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <main className="flex min-h-screen flex-col bg-white">
        <section className="mx-auto flex min-h-[600px] w-full flex-col items-center justify-center gap-12 bg-slate-950 px-4 py-16">
          <div className="mx-auto w-full max-w-7xl text-center">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
                <span className="text-[hsl(280,100%,70%)]">
                  Project planner
                </span>{" "}
                The Ultimate Tool for your Project&apos;s Success
              </h1>

              <span className="mx-auto block text-center text-xl text-slate-300">
                Discover the ultimate project planner to organize, track, and
                complete your projects effortlessly.
              </span>
            </div>
          </div>
        </section>

        <div className="w-full">
          <svg
            viewBox="0 0 1440 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            className="bg-transparent"
          >
            <path
              d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
              fill="#150002"
            ></path>
          </svg>
        </div>

        <section className="flex w-full flex-col gap-24 px-4 py-24">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12">
            <h2 className="text-3xl font-semibold md:text-[2rem]">
              Manage your project
            </h2>

            <div className="relative aspect-[871/573] w-full max-w-2xl rounded-lg border object-contain shadow-xl">
              <Image
                src="/assets/screenshot-1.png"
                alt="Screenshot of the Members management page"
                fill={true}
              />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12">
            <h2 className="text-3xl font-semibold md:text-[2rem]">
              Track your tasks
            </h2>

            <div className="relative aspect-[871/573] w-full max-w-2xl rounded-lg border object-contain shadow-xl">
              <Image
                src="/assets/screenshot-1.png"
                alt="Screenshot of the Members management page"
                fill={true}
              />
            </div>
          </div>
        </section>
      </main>

      <div className="w-full">
        <svg
          viewBox="0 0 1440 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          className="bottom-0 bg-transparent"
        >
          <path
            transform="rotate(180) translate(-1440, -60)"
            d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
            fill="#150002"
          ></path>
        </svg>
      </div>

      <footer className="flex min-h-[300px] w-full flex-col items-center justify-center bg-black">
        <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between gap-12 px-4 py-20">
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-2xl font-bold text-white md:text-3xl">
                ProjectPlanner
              </h1>
            </Link>
          </div>

          <span className="text-slate-400">
            Copyright @ 2022. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
