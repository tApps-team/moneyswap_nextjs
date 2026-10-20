"use client";

import { ReactNode } from "react";
import {
  COMPONENT_ENUM_LABELS,
  COMPONENT_FIELD_LABELS,
  ENUM_LABELS,
  FIELD_LABELS,
  humanize,
} from "@/cms/config/labels";
import { CmsAttribute, CmsAttributes, isRelation, isToMany, relationTarget } from "@/cms/schema/attributes";
import { CmsMedia } from "../media";
import {
  BooleanInput,
  DateInput,
  EnumInput,
  NumberInput,
  SlugGenerateButton,
  TextAreaInput,
  TextInput,
} from "./fields/basic-fields";
import { BlocksEditor } from "./fields/blocks-editor";
import { ComponentInput, RenderInner } from "./fields/component-field";
import { DynamicZoneInput } from "./fields/dynamic-zone-field";
import { FieldShell } from "./fields/field-shell";
import { MediaInput } from "./fields/media-field";
import { RelationInput } from "./fields/relation-field";
import { FormValues, RelationItem } from "./form-model";

export interface FieldContext {
  /** uid типа, к которому относится поле — нужен для поиска кандидатов связи. */
  uid: string;
  label: (field: string) => string;
  hint?: (field: string) => string | undefined;
  enumLabel: (field: string, value: string) => string;
  componentAttrs: (uid: string) => CmsAttributes | undefined;
  componentTitle: (uid: string) => string;
  /** Значение «главного» поля — источник для генерации slug. */
  mainValue?: unknown;
  /** Поле адреса записи, рядом с которым кнопка «Из названия». По умолчанию slug. */
  slugField?: string;
  errors: Record<string, string>;
  isDisabled: (field: string) => boolean;
}

/** Подписи внутри компонента: сначала по самому компоненту, потом общий словарь. */
const innerLabel = (componentUid: string) => (field: string) =>
  COMPONENT_FIELD_LABELS[componentUid]?.[field] ?? FIELD_LABELS[field] ?? humanize(field);
const innerEnum = (field: string, value: string) =>
  COMPONENT_ENUM_LABELS[field]?.[value] ?? ENUM_LABELS[field]?.[value] ?? value;

/**
 * Рендер полей внутри компонента или блока dynamic zone: подписи из общего
 * словаря, права и ошибки — по полю-контейнеру.
 */
function innerRenderer(
  attrs: CmsAttributes,
  ctx: FieldContext,
  disabled: boolean,
  componentUid: string,
): RenderInner {
  return function InnerField({ name, value, onChange, idPrefix }) {
    return (
      <FieldRenderer
        name={name}
        attribute={attrs[name]}
        value={value}
        onChange={onChange}
        idPrefix={idPrefix}
        ctx={{
          ...ctx,
          label: innerLabel(componentUid),
          enumLabel: innerEnum,
          hint: undefined,
          errors: {},
          isDisabled: () => disabled,
          mainValue: undefined,
        }}
      />
    );
  };
}

export function FieldRenderer({
  name,
  attribute,
  value,
  onChange,
  ctx,
  idPrefix = "f",
}: {
  name: string;
  attribute: CmsAttribute;
  value: unknown;
  onChange: (v: unknown) => void;
  ctx: FieldContext;
  idPrefix?: string;
}): ReactNode {
  const id = `${idPrefix}-${name}`;
  const label = ctx.label(name);
  const error = ctx.errors[name];
  const disabled = ctx.isDisabled(name);
  const shell = (children: ReactNode, aside?: ReactNode) => (
    <FieldShell
      id={id}
      label={label}
      required={attribute.required}
      hint={ctx.hint?.(name)}
      error={error}
      aside={aside}
    >
      {children}
    </FieldShell>
  );

  switch (attribute.type) {
    case "string":
    case "email":
    case "uid":
      return shell(
        <TextInput
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          invalid={Boolean(error)}
          type={attribute.type === "email" ? "email" : "text"}
          maxLength={"maxLength" in attribute ? attribute.maxLength : undefined}
        />,
        name === (ctx.slugField ?? "slug") && !disabled ? (
          <SlugGenerateButton source={ctx.mainValue} onGenerate={(v) => onChange(v)} />
        ) : undefined,
      );
    case "text":
      return shell(<TextAreaInput id={id} value={value} onChange={onChange} disabled={disabled} invalid={Boolean(error)} />);
    case "integer":
    case "biginteger":
    case "decimal":
    case "float":
      return shell(
        <NumberInput
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          integer={attribute.type === "integer" || attribute.type === "biginteger"}
          invalid={Boolean(error)}
        />,
      );
    case "boolean":
      return shell(<BooleanInput id={id} value={value} onChange={onChange} disabled={disabled} />);
    case "enumeration":
      return shell(
        <EnumInput
          id={id}
          value={value}
          options={attribute.enum.map((v) => ({ value: v, label: ctx.enumLabel(name, v) }))}
          onChange={onChange}
          disabled={disabled}
          required={attribute.required}
          invalid={Boolean(error)}
        />,
      );
    case "date":
    case "datetime":
      return shell(
        <DateInput id={id} value={value} onChange={onChange} withTime={attribute.type === "datetime"} disabled={disabled} />,
      );
    case "media":
      return shell(
        <MediaInput
          value={value as CmsMedia | CmsMedia[] | null}
          onChange={onChange}
          multiple={attribute.multiple}
          allowedTypes={attribute.allowedTypes}
          disabled={disabled}
        />,
      );
    case "relation":
      if (!isRelation(attribute)) return null;
      return shell(
        <RelationInput
          source={ctx.uid}
          field={name}
          target={relationTarget(attribute)}
          label={label}
          multiple={isToMany(attribute)}
          value={value as RelationItem[] | RelationItem | null}
          onChange={onChange}
          disabled={disabled}
        />,
      );
    case "blocks":
      return shell(
        <BlocksEditor id={id} value={value} onChange={onChange} disabled={disabled} invalid={Boolean(error)} />,
      );
    case "component": {
      const attrs = ctx.componentAttrs(attribute.component);
      if (!attrs) return null;
      return (
        <ComponentInput
          attrs={attrs}
          repeatable={Boolean(attribute.repeatable)}
          value={value as FormValues[] | FormValues | null}
          onChange={onChange}
          noun={ctx.componentTitle(attribute.component)}
          disabled={disabled}
          idPrefix={id}
          renderInner={innerRenderer(attrs, ctx, disabled, attribute.component)}
        />
      );
    }
    case "dynamiczone":
      return (
        <DynamicZoneInput
          components={attribute.components}
          value={value as FormValues[] | null}
          onChange={onChange}
          componentAttrs={ctx.componentAttrs}
          componentTitle={ctx.componentTitle}
          disabled={disabled}
          idPrefix={id}
          renderInner={(attrs, uid) => innerRenderer(attrs, ctx, disabled, uid)}
        />
      );
    default:
      return null;
  }
}
