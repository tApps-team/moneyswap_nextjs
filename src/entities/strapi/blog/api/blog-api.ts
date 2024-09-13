import {
  GetAllArticlesRequest,
  GetAllArticlesResponse,
  GetAllCategoriesResponse,
  GetAllTagsResponse,
  GetArticleRequest,
  GetArticleResponse,
  GetCategoryArticlesRequest,
  GetCategoryArticlesResponse,
  GetSearchArticlesRequest,
  GetSearchArticlesResponse,
  GetTagArticlesRequest,
  GetTagArticlesResponse,
  GetTopicArticlesRequest,
  GetTopicArticlesResponse,
} from "./blog-dto";

export const getAllArticles = async (
  params: GetAllArticlesRequest,
): Promise<GetAllArticlesResponse> => {
  const { page, elements, searchValue } = params;

  try {
    const searchFilter = searchValue
      ? `&filters[$or][0][preview_title][$containsi]=${searchValue}&filters[$or][1][article_title][$containsi]=${searchValue}&filters[$or][2][preview_description][$containsi]=${searchValue}&filters[$or][3][content][$containsi]=${searchValue}`
      : "";
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-articles?pagination[page]=${page}&pagination[pageSize]=${elements}&sort=publishedAt:desc&populate=preview_image${searchFilter}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getArticle = async (params: GetArticleRequest): Promise<GetArticleResponse> => {
  const { url_name } = params;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-articles?filters[url_name][$eq]=${url_name}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getSearchArticles = async (
  params: GetSearchArticlesRequest,
): Promise<GetSearchArticlesResponse> => {
  const { value } = params;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-articlessd?filters[$or][0][preview_title][$contains]=${value}&filters[$or][1][content][$contains]=${value}&filters[$or][2][preview_description][$contains]=${value}&filters[$or][3][article_title][$contains]=${value}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getTopicArticles = async (
  params: GetTopicArticlesRequest,
): Promise<GetTopicArticlesResponse> => {
  const { topic } = params;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-topics?filters[type][$eq]=${topic}&populate[articles][populate][preview_image]=*
`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getAllTags = async (): Promise<GetAllTagsResponse> => {
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getCategoryArticles = async (
  params: GetCategoryArticlesRequest,
): Promise<GetCategoryArticlesResponse> => {
  const { category } = params;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?filters[category][$eq]=${category}&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getTagArticles = async (
  params: GetTagArticlesRequest,
): Promise<GetTagArticlesResponse> => {
  const { tag } = params;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?filters[tag][$eq]=${tag}&populate[articles][populate][preview_image]=*
`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
