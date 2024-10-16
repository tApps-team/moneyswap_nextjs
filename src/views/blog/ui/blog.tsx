import { Metadata } from "next";
import { AllArticles, BlogSidebar, SliderOfArticles } from "@/widgets/strapi";
import { CategoriesList } from "@/features/strapi";
import { getAllArticles, getAllCategories, getTopicArticles, topics } from "@/entities/strapi";

export const BlogPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = searchParams.page ? Number(searchParams?.page) : 1;
  const searchValue = searchParams.search ? searchParams.search.toString() : null;
  const elements = 4;

  const { data: all, meta } = await getAllArticles({ page, elements, searchValue });
  const { data: readersChoice } = await getTopicArticles({ topic: topics.readers_choice });
  const { data: recommended } = await getTopicArticles({ topic: topics.platform_recommended });
  const { data: categories } = await getAllCategories();

  const totalPages = Math.ceil(meta?.pagination?.total / elements);

  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-semibold text-center max-w-[80%]">
          Блог о финансах, криптовалюте и переводах за рубеж
        </h1>
      </div>
      <CategoriesList categories={categories?.categories} />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <AllArticles articles={all} totalPages={totalPages} page={page} />
        <BlogSidebar searchValue={searchValue} isMain />
      </div>
      <div className="pt-8 grid gap-[60px]">
        <SliderOfArticles title={readersChoice?.name} articles={readersChoice?.articles} />
        <SliderOfArticles title={recommended?.name} articles={recommended?.articles} />
      </div>
    </section>
  );
};
