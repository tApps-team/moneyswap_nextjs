import Image from "next/image";

export const EmptyList = () => {
  return (
    <div className="grid justify-items-center gap-4 col-span-2 mb-[24px]">
      <Image
        width={300}
        height={300}
        alt="empty list image"
        src="/animated/notfound.gif"
        className="w-[60px] h-[60px]"
      />
      <p className="text-center text-white text-l font-light">Ничего не найдено...</p>
    </div>
  );
};
