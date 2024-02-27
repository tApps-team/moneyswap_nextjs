import { getAvailable } from "@/entities/categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

type DirectionTabsProps = {};
export const DirectionTabs = async () => {
  const directions = await getAvailable("all");
  const directionKeys = Object.keys(directions.ru);
  return (
    <Tabs>
      <TabsList>
        {directionKeys.map((direction) => (
          <TabsTrigger key={direction} value={direction}>
            {direction}
          </TabsTrigger>
        ))}
      </TabsList>
      {directionKeys.map((direction) => (
        <TabsContent key={direction + direction.length} value={direction}>
          {direction}
        </TabsContent>
      ))}
    </Tabs>
  );
};
