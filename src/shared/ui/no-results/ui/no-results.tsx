import { NoResultIcon } from "@/shared/assets";

export const NoResults = ({ ...props }) => {
  return (
    <div {...props}>
      <p className="text-xs text-[#ddd] font-medium uppercase text-center opacity-50">No results</p>
      <div className="grayscale flex justify-center items-center w-[70%] h-[70%] pt-[20px]">
        <NoResultIcon widht="100%" height="100%" />
      </div>
    </div>
  );
};
