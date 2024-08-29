import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LoggedInLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="flex flex-row items-center justify-between border">
        {/** DESKTOP NAVIGATION */}
        <div className="mx-auto hidden h-24 w-full max-w-7xl items-center justify-between gap-x-6 p-6 sm:flex lg:px-8">
          <div className="flex items-center gap-x-4">
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-3xl font-bold">
                LOGO
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
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
        </div>

        {/** MOBILE NAVIGATION */}
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-x-6 p-4 sm:hidden">
          <div>
            <Link href="/dashboard">
              <h1 className="relative flex select-none flex-row items-baseline text-3xl font-bold">
                LOGO
              </h1>
            </Link>
          </div>

          <div className="flex gap-4">
            <button
              className="hamburger mr-2 flex aspect-square h-9 items-center justify-center rounded-md border-none px-0 py-2 text-sm font-medium shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:hidden"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:r4m:"
              data-state="closed"
            >
              {/* <svg
                fill="none"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <g>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16"
                  ></path>
                </g>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 12h16"
                ></path>
                <g>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 18h16"
                  ></path>
                </g>
              </svg> */}
              X
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto h-24 w-full max-w-7xl gap-x-6 p-6 lg:px-8">
        {children}
      </main>
    </>
  );
}
