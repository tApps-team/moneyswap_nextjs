import { CmsContentType, CmsPermission } from "./types";

/** Действия Content Manager — те же строки, что проверяет сам Strapi. */
export const CM_ACTION = {
  read: "plugin::content-manager.explorer.read",
  create: "plugin::content-manager.explorer.create",
  update: "plugin::content-manager.explorer.update",
  delete: "plugin::content-manager.explorer.delete",
  publish: "plugin::content-manager.explorer.publish",
} as const;

export type CmAction = keyof typeof CM_ACTION;

/**
 * Права пользователя в удобном виде.
 *
 * На клиенте это только UX: скрыть кнопку, недоступную коллекцию или поле.
 * Настоящую проверку на каждый запрос делает Strapi, и поля без доступа он
 * сам вырезает и из ответа, и из запроса.
 */
export function createAbility(permissions: CmsPermission[]) {
  const find = (action: CmAction, uid: string) =>
    permissions.filter((p) => p.action === CM_ACTION[action] && p.subject === uid);

  return {
    can: (action: CmAction, uid: string) => find(action, uid).length > 0,

    /**
     * Разрешённые поля для действия. `null` — разрешены все: так Strapi
     * кодирует право без ограничения по полям.
     */
    fields: (action: CmAction, uid: string): string[] | null => {
      const matched = find(action, uid);
      if (!matched.length) return [];
      if (matched.some((p) => !p.properties?.fields)) return null;
      return Array.from(new Set(matched.flatMap((p) => p.properties.fields ?? [])));
    },
  };
}

export type CmsAbility = ReturnType<typeof createAbility>;

/**
 * Типы контента, которые пользователь видит в меню — по тому же правилу, что
 * и штатная админка: коллекция — при праве на чтение или создание, single type —
 * при праве на чтение, и только если тип не скрыт из Content Manager.
 */
export function visibleContentTypes(
  contentTypes: CmsContentType[],
  ability: CmsAbility,
): CmsContentType[] {
  return contentTypes.filter((ct) => {
    if (!ct.isDisplayed || !ct.uid.startsWith("api::")) return false;
    if (ct.kind === "singleType") return ability.can("read", ct.uid);
    return ability.can("read", ct.uid) || ability.can("create", ct.uid);
  });
}

/**
 * Разрешено ли поле. Права на поля компонентов Strapi хранит путями через
 * точку («promocodes.title»), поэтому компонент доступен, если разрешено
 * хоть одно его вложенное поле. `null` — разрешены все поля.
 */
export const isFieldAllowed = (fields: string[] | null, name: string) =>
  fields === null || fields.some((f) => f === name || f.startsWith(`${name}.`));
