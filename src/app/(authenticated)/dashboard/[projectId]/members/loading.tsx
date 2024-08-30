import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2">
      <LoaderCircle className="h-20 w-20" />
      <span className="text-center text-xl font-semibold">Loading...</span>
    </div>
  );
}
