import { BlogSidebar } from "@/widgets/blog";
import { getArticle } from "@/entities/strapi";

export const BlogArticlePage = async ({ params }: { params: { url_name: string } }) => {
  const url = params.url_name;
  const { data: articles } = await getArticle({ url_name: url });
  const article = articles[0];
  return (
    <section className="grid grid-flow-rows gap-6">
      <div className="grid grid-flow-rows gap-6">
        <h1 className="text-3xl font-medium uppercase max-w-[70%]">{article?.article?.title}</h1>
        <p className="text-[#bbbbbb] font-medium text-sm uppercase">{article?.publishedAt}</p>
      </div>
      <section className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <div className="grid grid-flow-rows gap-10">
          <div className="w-full h-auto max-h-[1000px] rounded-[35px] overflow-hidden">
            <img
              className="w-full h-full object-contain"
              src={article?.preview?.image}
              alt={article?.preview?.title}
            />
          </div>
          <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: article?.article?.content }}
          />
        </div>
        <BlogSidebar />
      </section>
    </section>
  );
};
