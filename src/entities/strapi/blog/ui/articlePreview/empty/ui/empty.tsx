import Image from "next/image";

export const EmptyArticle = () => {
  return (
    <div className="rounded-[30px] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] border-2 border-[rgba(0,0,0,0)] hover:border-yellow-main transition-all duration-300">
      <div className="w-full h-[10vw] max-h-[400px] rounded-t-[35px] overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src="/no_result.jpg"
          alt="empty_icon"
          width={500}
          height={500}
        />
      </div>
      <div className="uppercase grid grid-flow-row  gap-2 p-4">
        <p className="text-light-gray font-medium text-2xs">date skeleton</p>
        <h3 className="text-xs font-medium max-h-[200px] overflow-hidden text-ellipsis leading-4 line-clamp-2">
          title skeleton
        </h3>
      </div>
    </div>
  );
};
