import {
  GetAllArticlesRequest,
  GetAllArticlesResponse,
  GetAllCategoriesResponse,
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

export const getAllArticles = async (
  params: GetAllArticlesRequest,
): Promise<GetAllArticlesResponse> => {
  const { page, elements, searchValue } = params;

  try {
    const searchFilter = searchValue
      ? `&filters[$or][0][preview_title][$containsi]=${searchValue}&filters[$or][1][preview_description][$containsi]=${searchValue}`
      : "";
    const current_url = elements
      ? `${process.env.STRAPI_BASE_URL}/api/blog-articles?pagination[page]=${page}&pagination[pageSize]=${elements}&sort=publishedAt:desc${searchFilter}`
      : `${process.env.STRAPI_BASE_URL}/api/blog-articles?pagination[page]=${page}&sort=publishedAt:desc${searchFilter}`;

    // Отключаем кеширование для больших запросов (>100 элементов), чтобы избежать ошибки "items over 2MB"
    const cacheOption = elements && elements > 100 ? { cache: 'no-store' as const } : {};

    const res = await fetch(current_url, {
      method: "GET",
      ...cacheOption,
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
      cache: 'force-cache',
      next: { 
        tags: ['article', `article-${url_name}`] 
      }
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
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-topics?pagination[pageSize]=100&filters[type][$eq]=${topic}&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: 'force-cache',
      next: { 
        tags: ['topic-articles', `topic-${topic}`] 
      }
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?pagination[pageSize]=100&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: 'force-cache',
      next: { 
        tags: ['categories'] 
      }
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};

export const getAllTags = async (): Promise<GetAllTagsResponse> => {
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?pagination[pageSize]=100&populate[articles][populate][preview_image]=*`;
    const res = await fetch(url, {
      method: "GET",
      cache: 'force-cache',
      next: { 
        tags: ['tags'] 
      }
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
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-categories?pagination[pageSize]=1000&filters[category][$eq]=${category}&populate[articles][populate][preview_image]=*&populate[articles][sort][0]=publishedAt:desc`;
    const res = await fetch(url, {
      method: "GET",
      cache: 'force-cache',
      next: { 
        tags: ['category-articles', `category-${category}`] 
      }
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
    const url = `${process.env.STRAPI_BASE_URL}/api/blog-article-tags?pagination[pageSize]=1000&filters[tag][$eq]=${tag}&populate[articles][populate][preview_image]=*&populate[articles][sort][0]=publishedAt:desc`;
    const res = await fetch(url, {
      method: "GET",
      cache: 'force-cache',
      next: { 
        tags: ['tag-articles', `tag-${tag}`] 
      }
    });
    return res.json();
  } catch (error) {
    console.error("error:", error);
    throw new Error("Failed to fetch data");
  }
};
