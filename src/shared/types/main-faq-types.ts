export interface MainFaqs {
  data: {
    id: number;
    question: string;
    answer: string;
    type: mainFaqTypes;
  }[];
}

export enum mainFaqTypes {
  cash = "cash",
  noncash = "noncash",
  basic = "basic",
}
