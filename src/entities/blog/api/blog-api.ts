import {
  GetAllCategoriesRequest,
  GetAllCategoriesResponse,
  GetAllTagsRequest,
  GetAllTagsResponse,
  GetArticleRequest,
  GetArticleResponse,
  GetCategoryArticlesRequest,
  GetCategoryArticlesResponse,
  GetTagArticlesRequest,
  GetTagArticlesResponse,
  GetTopicArticlesRequest,
  GetTopicArticlesResponse,
} from "./blog-dto";

export const getArticle = async (params: GetArticleRequest): Promise<GetArticleResponse> => {
  const { url_name } = params;

  const url = `${process.env.STRAPI_BASE_URL}/api/blog-articles?filters[url_name][$eq]=${url_name}&populate=categories&populate=preview_image&populate=tags`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getTopicArticles = async (
  params: GetTopicArticlesRequest,
): Promise<GetTopicArticlesResponse> => {
  const { topic } = params;

  const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-topics?filters[type][$eq]=${topic}&populate[articles][populate][preview_image]=*
`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
  const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?&populate[articles][populate][preview_image]=*`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getAllTags = async (): Promise<GetAllTagsResponse> => {
  const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?&populate[articles][populate][preview_image]=*`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getCategoryArticles = async (
  params: GetCategoryArticlesRequest,
): Promise<GetCategoryArticlesResponse> => {
  const { category } = params;

  const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?filters[category][$eq]=${category}&populate[articles][populate][preview_image]=*`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getTagArticles = async (
  params: GetTagArticlesRequest,
): Promise<GetTagArticlesResponse> => {
  const { tag } = params;

  const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?filters[tag][$eq]=${tag}&populate[articles][populate][preview_image]=*
`;

  const res = await fetch(url, { method: "GET", cache: "default" });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
