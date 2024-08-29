import { FC } from "react";
import { ArticleSearch, TagsList, TelegramBanner } from "@/features/strapi";
import { getAllTags } from "@/entities/strapi";
import { routes } from "@/shared/router";

interface BlogSidebarProps {}

export const BlogSidebar: FC<BlogSidebarProps> = async () => {
  const { data: tags } = await getAllTags();
  return (
    <section
      className={`grid grid-flow-rows gap-6 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[rgba(45,45,45,0.6)] backdrop-blur-lg p-6 sticky top-[100px] right-0`}
    >
      <ArticleSearch />
      <TagsList tags={tags?.tags} />
      <TelegramBanner />
    </section>
  );
};
