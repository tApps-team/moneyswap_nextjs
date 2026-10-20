import { SearchX } from "lucide-react";
import Link from "next/link";
import { CMS_BASE } from "@/cms/config/paths";

/** Раздела нет или он недоступен роли пользователя. */
export function CmsNotAvailable() {
  return (
    <div className="min-h-[50vh] grid place-items-center text-center px-4">
      <div className="grid gap-3 justify-items-center max-w-sm">
        <SearchX className="size-10 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Раздел не найден</h1>
        <p className="text-sm text-muted-foreground">
          Такого раздела нет или у вашей роли нет к нему доступа.
        </p>
        <Link href={CMS_BASE} className="text-sm text-primary hover:underline">
          Вернуться к обзору
        </Link>
      </div>
    </div>
  );
}
