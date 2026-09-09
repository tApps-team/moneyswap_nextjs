/** Заглушка полки: высота совпадает с реальной карточкой, чтобы не было скачка вёрстки. */
export const PreviewsSliderSkeleton = () => {
  return (
    <div className="grid gap-5 min-w-0">
      <div className="grid gap-2">
        <div className="h-6 w-56 max-w-full rounded-[8px] bg-new-dark-grey animate-pulse" />
        <div className="h-4 w-80 max-w-full rounded-[8px] bg-new-dark-grey/70 animate-pulse" />
      </div>
      <div className="flex gap-3 mobile-xl:gap-4 overflow-hidden min-w-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[320px] shrink-0 basis-[85%] mobile-xl:basis-1/2 md:basis-1/3 xl:basis-1/4 rounded-[20px] border border-new-grey/60 bg-new-dark-grey animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
