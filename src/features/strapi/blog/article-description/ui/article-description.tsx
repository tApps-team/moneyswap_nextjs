// import parse, { DOMNode, Element } from "html-react-parser";
// import Image from "next/image";
// import { Article } from "@/entities/strapi";

// const options = {
//   replace: (domNode: DOMNode) => {
//     // Проверяем, является ли узел элементом и его типом является img
//     if (domNode instanceof Element && domNode.name === "img") {
//       const { src, alt } = domNode.attribs;
//       return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
//     }
//     if (domNode instanceof Element && domNode.name === "br") {
//       return <hr />;
//     }
//   },
// };

// export const ArticleDescription = ({ article }: { article: Article }) => {
//   return (
//     <div className="md:overflow-visible overflow-y-auto md:max-h-full max-h-[20svh] md:p-0 px-6 pt-4 text-sm uppercase strapi_styles strapi_fonts_codec">
//       {parse(article?.article?.description, options)}
//     </div>
//   );
// };

import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import { Article } from "@/entities/strapi";

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
    if (domNode instanceof Element && domNode.name === "br") {
      return <hr />;
    }
  },
};

export const ArticleDescription = ({ article }: { article: Article }) => {
  return (
    <div className="relative mobile-xl:p-0 px-2 pb-2">
      <div className={`overflow-hidden text-sm uppercase strapi_styles strapi_fonts_codec`}>
        {parse(article?.article?.description, options)}
      </div>
    </div>
  );
};
