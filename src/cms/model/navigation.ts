import { LucideIcon } from "lucide-react";
import { CMS_COLLECTIONS, CMS_GROUPS, CmsGroupKey } from "../config/collections";
import { CMS_BASE } from "../config/paths";
import { createAbility, visibleContentTypes } from "./permissions";
import { CmsContentType, CmsPermission } from "./types";

export interface CmsNavItem {
  uid: string;
  title: string;
  href: string;
  kind: CmsContentType["kind"];
  icon?: LucideIcon;
}

export interface CmsNavGroup {
  key: CmsGroupKey;
  title: string;
  items: CmsNavItem[];
}

/** Адрес раздела CMS для типа контента. */
export const contentTypeHref = (ct: Pick<CmsContentType, "kind" | "info">) =>
  ct.kind === "singleType"
    ? `${CMS_BASE}/single/${ct.info.singularName}`
    : `${CMS_BASE}/${ct.info.singularName}`;

export const contentTypeTitle = (ct: Pick<CmsContentType, "uid" | "info">) =>
  CMS_COLLECTIONS[ct.uid]?.title ?? ct.info.displayName;

/**
 * Меню CMS: только типы, доступные пользователю, разложенные по группам
 * в порядке из конфига. Порядок внутри группы — как в конфиге, неизвестные
 * типы — в конце по алфавиту.
 */
export function buildNavigation(
  contentTypes: CmsContentType[],
  permissions: CmsPermission[],
): CmsNavGroup[] {
  const ability = createAbility(permissions);
  const configOrder = Object.keys(CMS_COLLECTIONS);
  const visible = visibleContentTypes(contentTypes, ability);

  const sorted = [...visible].sort((a, b) => {
    const ia = configOrder.indexOf(a.uid);
    const ib = configOrder.indexOf(b.uid);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
    return contentTypeTitle(a).localeCompare(contentTypeTitle(b), "ru");
  });

  return CMS_GROUPS.map((group) => ({
    key: group.key,
    title: group.title,
    items: sorted
      .filter((ct) => (CMS_COLLECTIONS[ct.uid]?.group ?? "other") === group.key)
      .map((ct) => ({
        uid: ct.uid,
        title: contentTypeTitle(ct),
        href: contentTypeHref(ct),
        kind: ct.kind,
        icon: CMS_COLLECTIONS[ct.uid]?.icon,
      })),
  })).filter((group) => group.items.length > 0);
}

/** Имя пользователя для оболочки: имя и фамилия, иначе логин или email. */
export const userDisplayName = (user: {
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  email: string;
}) => [user.firstname, user.lastname].filter(Boolean).join(" ") || user.username || user.email;
