import { Category } from "./category";
import { Tag } from "./tag";

export interface Article {
  id: number;
  url_name: string;
  preview: {
    title: string;
    description: string;
    image: string;
  };
  article: {
    table_of_contents: TableOfContents[];
    title: string;
    content: string;
  };
  categories: Category[];
  tags: Tag[];
  publishedAt: string;
}

export interface ArticlePreview {
  url_name: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
}

export interface TableOfContents {
  title: string;
  id: string;
}
