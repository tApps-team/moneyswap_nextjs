import {
  ArticleSearch,
  TableOfContentsBlockSkeleton,
  TagsListSkeleton,
  TelegramBanner,
} from "@/features/strapi";

export const BlogSidebarSkeleton = ({ table_of_contents }: { table_of_contents?: boolean }) => {
  return (
    <section className="lg:h-full h-auto lg:static sticky top-[100px]">
      <div
        className={`grid grid-rows-[auto_1fr_auto] xl:gap-6 gap-4 lg:rounded-[15px] rounded-[10px] bg-new-dark-grey backdrop-blur-lg xl:p-6 lg:p-5 p-4 overflow-hidden`}
      >
        <ArticleSearch currentValue={null} />
        {table_of_contents ? <TableOfContentsBlockSkeleton /> : <TagsListSkeleton />}
        <TelegramBanner />
      </div>
    </section>
  );
};
