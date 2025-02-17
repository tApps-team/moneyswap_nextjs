import Link from "next/link";
import { getAllTags } from "@/entities/strapi";
import { routes } from "@/shared/router";

export const MobileTagsList = async () => {
  const { data: tags } = await getAllTags();
  return (
    <section className="rounded-[10px] bg-new-dark-grey mobile-xl:px-5 mobile-xl:py-5 py-3 px-3 md:hidden block mx-auto w-full">
      <div className="grid grid-flow-row gap-3">
        <h3 className="text-yellow-main font-normal mobile-xl:text-lg text-base truncate text-center">
          Популярные хэштеги
        </h3>
        <section className="overflow-auto max-h-[100px] flex flex-wrap mobile-xl:justify-start justify-center gap-2 px-2">
          {tags?.tags?.map((tag) => (
            <Link
              href={`${routes.blog}${routes.tag}/${tag?.tag}`}
              className="text-[#ddd] mobile-xl:text-sm text-xs leading-2 hover:text-yellow-main cursor-pointer transition-all hover:transition-all duration-300"
              key={tag?.id}
            >
              {tag?.name}
            </Link>
          ))}
        </section>
      </div>
    </section>
  );
};
