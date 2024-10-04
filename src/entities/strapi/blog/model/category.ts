import { ArticlePreview } from "./article";

export interface Category {
  id: number;
  name: string;
  category: string | null;
}

export interface CategoryWithArticles extends Category {
  articles: ArticlePreview[];
  categories: Category[];
}
