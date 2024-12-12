import Image from "next/image";

export const EmptyList = () => {
  return (
    <div className="flex flex-col justify-center justify-items-center items-center my-auto gap-4 mb-[24px] h-full">
      <Image
        width={300}
        height={300}
        alt="empty list image"
        src="/animated/search_spin.gif"
        className="w-[60px] h-[60px]"
      />
      <p className="text-center text-white text-l font-light uppercase text-xs">
        Ничего не найдено...
      </p>
    </div>
  );
};
