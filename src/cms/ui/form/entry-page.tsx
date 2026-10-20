"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { contentTypeHref } from "@/cms/model/navigation";
import { useContentTypeBySlug } from "@/cms/model/use-content-type";
import { buildCollectionModel } from "@/cms/schema/collection";
import { CmsNotAvailable } from "../not-available";
import { EntryEditor } from "./entry-editor";

/** Запись коллекции: /strapi/<коллекция>/<id> или /strapi/<коллекция>/new. */
export function CollectionEntryPage({ slug, idParam }: { slug: string; idParam: string }) {
  const params = useSearchParams();
  const resolved = useContentTypeBySlug(slug, "collectionType");
  const model = useMemo(
    () => (resolved ? buildCollectionModel(resolved.contentType, resolved.title) : null),
    [resolved],
  );
  const id = idParam === "new" ? null : Number(idParam);
  const from = Number(params.get("from")) || null;

  if (!resolved || !model || (id !== null && !Number.isInteger(id))) return <CmsNotAvailable />;
  return (
    <EntryEditor
      key={`${model.uid}:${idParam}:${from ?? ""}`}
      model={model}
      kind="collectionType"
      id={id}
      cloneFrom={id === null ? from : null}
      listHref={contentTypeHref(resolved.contentType)}
    />
  );
}

/** Single type: /strapi/single/<тип>. */
export function SingleTypePage({ slug }: { slug: string }) {
  const resolved = useContentTypeBySlug(slug, "singleType");
  const model = useMemo(
    () => (resolved ? buildCollectionModel(resolved.contentType, resolved.title) : null),
    [resolved],
  );
  if (!resolved || !model) return <CmsNotAvailable />;
  return <EntryEditor key={model.uid} model={model} kind="singleType" id={null} />;
}
