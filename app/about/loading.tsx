import { TopCoinsLoader } from "@/widgets/about/top-coins";
import { TopExchangersLoader } from "@/widgets/about/top-exchngers";
import { LoaderAnimation } from "@/shared/assets";
import { Skeleton } from "@/shared/ui";

const Loading = () => {
  return (
    // <section className="flex flex-col md:grid md:grid-cols-[0.7fr,0.3fr] gap-10">
    //   <Skeleton className="w-full md:h-1/6 h-44 " />
    //   <aside className="flex flex-col gap-6">
    //     <TopCoinsLoader />
    //     <TopExchangersLoader />
    //   </aside>
    // </section>
    <div className="min-h-[90svh]">
      <LoaderAnimation />
    </div>
  );
};
export default Loading;
