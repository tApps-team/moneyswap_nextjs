export interface Faq {
  id: number;
  question: string;
  answer: string;
  type: faqTypes;
}

export interface MainFaqs {
  data: Faq[];
}

export enum faqTypes {
  cash = "cash",
  noncash = "noncash",
  basic = "basic",
  from_users = "from_users",
  for_partners = "for_partners",
}

export enum faqTypeTabs {
  for_user = "FAQ для пользователей",
  for_partner = "FAQ для партнеров",
}
