import { ArticlePreview } from "./article";

export enum topics {
  main_topics = "main_topics",
  platform_recommended = "platform_recommended",
  readers_choice = "readers_choice",
}

export interface Topic {
  id: number;
  name: string;
  topic: topics;
  articles: ArticlePreview[];
}
