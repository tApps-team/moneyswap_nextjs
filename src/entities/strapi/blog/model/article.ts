import { Category } from "./category";
import { Tag } from "./tag";

export enum CustomButtonType {
  main_color = "main_color",
  grey_color = "grey_color",
  blue_color = "blue_color",
}

export enum ComponentPosition {
  left = "left",
  center = "center",
  right = "right",
}

export interface Paragraph {
  title: string | null;
  title_id: string | null;
  title_position: ComponentPosition;
  content: string;
}

export interface Quote {
  content: string;
  button?: string;
  button_type?: CustomButtonType;
}

export interface CustomButton {
  button: string;
  button_type: CustomButtonType;
  button_position: ComponentPosition;
}

export enum DynamicContentType {
  paragraph = "paragraph",
  quote = "quote",
  custom_button = "custom_button",
}

// Общий тип для контента динамической зоны
export type DynamicContentItem = {
  content_type: DynamicContentType;
  custom_button?: CustomButton;
  quote?: Quote;
  paragraph?: Paragraph;
};

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
    dynamic_content: DynamicContentItem[];
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
