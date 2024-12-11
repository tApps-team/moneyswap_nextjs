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
        className={`grid grid-flow-rows xl:gap-6 gap-4 lg:rounded-[30px] rounded-[24px] shadow-[1px_2px_10px_3px_rgba(0,0,0,0.5)] bg-[rgba(45,45,45,0.6)] backdrop-blur-lg xl:p-6 lg:p-5 p-4 overflow-hidden `}
      >
        <ArticleSearch currentValue={null} />
        {table_of_contents ? <TableOfContentsBlockSkeleton /> : <TagsListSkeleton />}
        <TelegramBanner />
      </div>
    </section>
  );
};
