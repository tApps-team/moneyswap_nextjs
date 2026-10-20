/** Админ-пользователь Strapi в том виде, в каком его отдаёт /admin/users/me. */
export interface CmsUser {
  id: number;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  email: string;
  roles: { id: number; name: string; code: string }[];
}

/** Одно право из /admin/users/me/permissions. */
export interface CmsPermission {
  action: string;
  subject: string | null;
  properties: {
    /** Отсутствует или null — разрешены все поля. */
    fields?: string[] | null;
  };
  conditions: string[];
}

/** Тип контента из /content-manager/init — только то, что нужно оболочке. */
export interface CmsContentType {
  uid: string;
  apiID: string;
  kind: "collectionType" | "singleType";
  isDisplayed: boolean;
  info: { displayName: string; singularName: string; pluralName: string };
  options: { draftAndPublish?: boolean };
  attributes: Record<string, unknown>;
}

/** Компонент из /content-manager/init (промокоды, блоки dynamic zone). */
export interface CmsComponent {
  uid: string;
  category: string;
  info: { displayName: string; icon?: string };
  attributes: Record<string, unknown>;
}

export interface CmsSession {
  user: CmsUser;
  permissions: CmsPermission[];
  contentTypes: CmsContentType[];
  components: CmsComponent[];
  /** Публичный адрес Strapi — для ссылок на медиа из /uploads. */
  strapiUrl: string;
}
