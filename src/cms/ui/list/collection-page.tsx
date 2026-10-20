"use client";

import { useMemo } from "react";
import { contentTypeHref } from "@/cms/model/navigation";
import { useContentTypeBySlug } from "@/cms/model/use-content-type";
import { buildCollectionModel } from "@/cms/schema/collection";
import { CmsNotAvailable } from "../not-available";
import { CollectionList } from "./collection-list";

export function CollectionPage({ slug }: { slug: string }) {
  const resolved = useContentTypeBySlug(slug, "collectionType");
  const model = useMemo(
    () => (resolved ? buildCollectionModel(resolved.contentType, resolved.title) : null),
    [resolved],
  );
  if (!resolved || !model) return <CmsNotAvailable />;
  // key: при переходе между коллекциями сбрасываем всё локальное состояние списка
  return <CollectionList key={model.uid} model={model} href={contentTypeHref(resolved.contentType)} />;
}
