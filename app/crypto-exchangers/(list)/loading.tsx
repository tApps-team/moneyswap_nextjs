import { LoaderAnimation } from "@/shared/assets";
import "@/shared/styles/globals.scss";

export default function Loading() {
  return (
    <div className="min-h-[90dvh]">
      <LoaderAnimation />
    </div>
  );
}
