import {
  Article,
  ArticlePreview,
  Category,
  CategoryWithArticles,
  Tag,
  TagWithArticles,
  Topic,
  topics,
} from "../model";

export type GetAllArticlesRequest = {
  page?: number;
  elements?: number;
  searchValue?: string | null;
};

export type GetAllArticlesResponse = {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type GetArticleRequest = {
  url_name: string;
};
export type GetArticleResponse = {
  data: Article[];
};
export type GetSearchArticlesRequest = {
  value: string;
};
export type GetSearchArticlesResponse = {
  data: ArticlePreview[];
};
export type GetTopicArticlesRequest = {
  topic: topics;
};
export type GetTopicArticlesResponse = {
  data: Topic;
};
export type GetAllCategoriesRequest = {};
export type GetAllCategoriesResponse = {
  data: {
    categories: Category[];
  };
};
export type GetCategoryArticlesRequest = {
  category: string;
};
export type GetCategoryArticlesResponse = {
  data: CategoryWithArticles;
};
export type GetAllTagsRequest = {};
export type GetAllTagsResponse = {
  data: {
    tags: Tag[];
  };
};
export type GetTagArticlesRequest = {
  tag: string;
};
export type GetTagArticlesResponse = {
  data: TagWithArticles;
};
