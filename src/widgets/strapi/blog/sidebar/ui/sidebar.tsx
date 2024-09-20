import { FC } from "react";
import { ArticleSearch, TableOfContentsBlock, TagsList, TelegramBanner } from "@/features/strapi";
import { getAllTags, TableOfContents } from "@/entities/strapi";
import { ScrollArea } from "@/shared/ui";

interface BlogSidebarProps {
  searchValue?: string | null;
  table_of_contents?: TableOfContents[];
}

export const BlogSidebar: FC<BlogSidebarProps> = async ({ searchValue, table_of_contents }) => {
  const { data: tags } = await getAllTags();

  return (
    <section
      className={`grid grid-flow-rows gap-6 rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[rgba(45,45,45,0.6)] backdrop-blur-lg p-6 sticky top-[80px] right-0`}
    >
      <ArticleSearch currentValue={searchValue || null} />
      {table_of_contents ? (
        <TableOfContentsBlock table_of_contents={table_of_contents || []} />
      ) : (
        <TagsList tags={tags?.tags} />
      )}
      <TelegramBanner />
    </section>
  );
};
