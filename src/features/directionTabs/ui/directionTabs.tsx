"use client";
import { memo, useMemo } from "react";
import { Categories } from "@/entities/categories";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";

type DirectionTabsProps = {
  directions?: Categories;
  directionExchange: string;
  setDirectionExchange: (directionExchange: string) => void;
};
export const DirectionTabs = memo((props: DirectionTabsProps) => {
  const { directions, directionExchange, setDirectionExchange } = props;
  const directionKeys = useMemo(() => Object.keys(directions || {}), [directions]);

  return (
    <Tabs
      onValueChange={(directionExchange) => setDirectionExchange(directionExchange)}
      value={directionExchange}
    >
      <TabsList className={`grid w-full grid-cols-3`}>
        {directionKeys.map((direction) => (
          <TabsTrigger key={direction} value={direction}>
            {direction}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
});
