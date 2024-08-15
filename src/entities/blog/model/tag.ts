import { ArticlePreview } from "./article";

export interface Tag {
  id: number;
  name: string;
  tag: string;
}

export interface TagWithArticles extends Tag {
  articles: ArticlePreview[];
  tags: Tag[];
}
