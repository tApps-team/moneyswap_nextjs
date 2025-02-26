import { Button } from "@/shared/ui";

export const AddReview = () => {
  return (
    <Button
      variant={"ghost"}
      className="mobile-xl:text-sm text-xs mobile-xl:w-fit w-full uppercase leading-none rounded-[10px] font-semibold py-3.5 bg-yellow-main text-black px-9"
    >
      Добавить отзыв об обменнике
    </Button>
  );
};
