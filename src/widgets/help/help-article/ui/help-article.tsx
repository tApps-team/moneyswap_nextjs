import { FC } from "react";

interface HelpArticleProps {
  article: string;
}

export const HelpArticle: FC<HelpArticleProps> = ({ article }) => {
  return <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: article }} />;
};
