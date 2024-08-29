export const EmptyArticle = () => {
  return (
    <div className="rounded-[35px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] border-2 border-[rgba(0,0,0,0)] hover:border-[#f6ff5f] transition-all duration-300">
      <div className="w-full h-[10vw] max-h-[400px] rounded-t-[35px] overflow-hidden">
        <img className="w-full h-full object-cover" src="/no_result.jpg" alt="empty_icon" />
      </div>
      <div className="uppercase grid grid-flow-row gap-2 p-4">
        <p className="text-[#bbbbbb] font-medium text-[10px]">date skeleton</p>
        <h3 className="text-xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
          title skeleton
        </h3>
        {/* <p
      className="text-[10px] font-light max-h-[200px] overflow-hidden line-clamp-4 strapi_styles"
      dangerouslySetInnerHTML={{ __html: article?.description }}
    /> */}
      </div>
    </div>
  );
};
