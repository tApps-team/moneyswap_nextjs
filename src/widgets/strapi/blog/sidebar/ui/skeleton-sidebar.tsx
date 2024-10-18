import {
  ArticleSearch,
  TableOfContentsBlockSkeleton,
  TagsListSkeleton,
  TelegramBanner,
} from "@/features/strapi";

export const BlogSidebarSkeleton = ({ table_of_contents }: { table_of_contents?: boolean }) => {
  return (
    <section className={`sticky top-[90px] right-0`}>
      <div
        className={`grid grid-flow-rows gap-6 rounded-[35px] shadow-[1px_3px_5px_2px_rgba(0,0,0,0.5)] bg-[rgba(45,45,45,0.6)] backdrop-blur-lg p-6`}
      >
        <ArticleSearch currentValue={null} />
        {table_of_contents ? <TableOfContentsBlockSkeleton /> : <TagsListSkeleton />}
        <TelegramBanner />
      </div>
    </section>
  );
};
