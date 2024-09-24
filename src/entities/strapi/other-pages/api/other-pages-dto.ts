import { DynamicContentItem } from "../../blog";

export type GetHelpPageResponse = {
  data: {
    title: string;
    content: DynamicContentItem[];
  };
};

export type GetAboutPageResponse = {
  data: {
    content: DynamicContentItem[];
  };
};

export type GetForPartnersPageResponse = {
  data: {
    content: DynamicContentItem[];
  };
};

export type GetCryptoExchangersPageResponse = {
  data: {
    title: string;
    header_description: string;
    footer_description: string;
  };
};
