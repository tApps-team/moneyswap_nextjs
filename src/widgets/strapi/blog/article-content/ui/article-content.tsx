import { FC } from "react";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { DynamicContentItem } from "@/entities/strapi";

interface ArticleContentProps {
  dynamic_content: DynamicContentItem[];
}

export const ArticleContent: FC<ArticleContentProps> = ({ dynamic_content }) => {
  return <DynamicContent dynamic_content={dynamic_content} />;
};
