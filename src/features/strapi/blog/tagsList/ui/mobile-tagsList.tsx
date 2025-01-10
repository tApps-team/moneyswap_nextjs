import Link from "next/link";
import { getAllTags } from "@/entities/strapi";
import { routes } from "@/shared/router";

export const MobileTagsList = async () => {
  const { data: tags } = await getAllTags();
  return (
    <section className="rounded-[20px] bg-[#000] py-3 px-3 md:hidden block mx-auto w-full mobile-xl:w-[80%] mt-8">
      <div className="grid grid-flow-row gap-3">
        <h3 className="uppercase text-yellow-main font-normal text-md truncate text-center">
          Популярные хэштеги
        </h3>
        <section className="flex flex-wrap justify-center gap-2 px-8">
          {tags?.tags?.map((tag) => (
            <Link
              href={`${routes.blog}${routes.tag}/${tag?.tag}`}
              className="text-[#ddd] text-xs leading-2 uppercase hover:text-yellow-main cursor-pointer transition-all hover:transition-all duration-300"
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
