import Link from "next/link";
import { Button } from "./_components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center bg-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 text-gray-700 md:flex-row">
        <div className="w-full max-w-xl">
          <div className="font-dark text-7xl font-bold">404</div>
          <p className="text-2xl font-light leading-normal md:text-4xl">
            Sorry we couldn&apos;t find this page.{" "}
          </p>
          <p className="mb-8 text-base md:text-xl">
            But don&apos;t worry, you can find plenty of other things on our
            homepage.
          </p>

          <Link href="/">
            <Button>Back to homepage</Button>
          </Link>
        </div>
        <div className="max-w-lg"></div>
      </div>
    </div>
  );
}
