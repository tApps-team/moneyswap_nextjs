import { AllArticles, BlogSidebar } from "@/widgets/blog";
import { CategoriesList } from "@/features/strapi";
import { getAllCategories, getTagArticles } from "@/entities/strapi";
import { routes } from "@/shared/router";

export const BlogTagPage = async ({ params }: { params: { tag: string } }) => {
  const tag = params.tag;
  const { data: articles } = await getTagArticles({ tag });
  const { data: categories } = await getAllCategories();

  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-semibold text-center max-w-[80%]">
          {articles?.name}
        </h1>
      </div>
      <CategoriesList categories={categories?.categories} selectedTag={tag} />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <AllArticles articles={articles?.articles} />
        <BlogSidebar />
      </div>
    </section>
  );
};
