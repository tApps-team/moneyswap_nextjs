"use client";

import { Pagination } from "@/features/pagination";
import { GetSitemapDirectionsDtoResponse } from "@/entities/exchanger";
import { routes } from "@/shared/router";

export const DirectionsPagination = ({ directionsData }: { directionsData: GetSitemapDirectionsDtoResponse }) => {
  return      (<div className="flex justify-center w-fit mx-auto">
  {directionsData && directionsData?.pages > 1 && (
    <Pagination
      currentPage={directionsData.page}
      totalPages={directionsData.pages}
        route={routes.directions}
      />
    )}
  </div>
  );
};
