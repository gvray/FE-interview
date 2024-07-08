import React, { useMemo } from "react";
import {
  PageMetadata,
  useCurrentSidebarCategory,
} from "@docusaurus/theme-common";
import { useAllDocsData } from "@docusaurus/plugin-content-docs/client";
import useBaseUrl from "@docusaurus/useBaseUrl";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import Heading from "@theme/Heading";
import type { Props } from "@theme/DocCategoryGeneratedIndexPage";
import styles from "./styles.module.css";

export default function DocCategoryGeneratedIndexPage({
  categoryGeneratedIndex,
}: Props): JSX.Element {
  const category = useCurrentSidebarCategory();
  const allDocsData = useAllDocsData();

  const imageUrl = categoryGeneratedIndex.image
    ? useBaseUrl(categoryGeneratedIndex.image)
    : undefined;

  // Build a quick lookup map: permalink -> doc metadata
  const docsByPermalink = useMemo(() => {
    const map = new Map<string, any>();
    try {
      const pluginValues = Object.values(allDocsData ?? {});
      for (const plugin of pluginValues as any[]) {
        const versions = plugin?.versions ?? [];
        const activeVersion =
          versions.find((v: any) => v?.isActive) ?? versions[0];
        const docs = activeVersion?.docs ?? [];
        for (const d of docs) {
          if (d?.permalink) map.set(d.permalink, d);
        }
      }
    } catch (e) {
      // noop
    }
    return map;
  }, [allDocsData]);

  // Sort items: by last updated desc when available; fallback to alphabetical
  const sortedItems = useMemo(() => {
    const items = category.items.slice();
    const normalizeTs = (ts: any): number | undefined => {
      if (!ts) return undefined;
      try {
        if (typeof ts === "number") return ts * (ts < 1e12 ? 1000 : 1); // seconds->ms if needed
        const d = new Date(ts);
        const n = d.getTime();
        return isNaN(n) ? undefined : n;
      } catch {
        return undefined;
      }
    };

    return items
      .map((it: any) => {
        const href = it?.href ?? it?.to ?? undefined;
        const meta = href ? docsByPermalink.get(href) : undefined;
        const ts = normalizeTs(meta?.lastUpdatedAt ?? meta?.date);
        const label = (it?.label ?? it?.title ?? "").toLowerCase();
        return { it, ts, label };
      })
      .sort((a: any, b: any) => {
        if (a.ts && b.ts) return b.ts - a.ts; // desc by time
        if (a.ts && !b.ts) return -1;
        if (!a.ts && b.ts) return 1;
        return a.label.localeCompare(b.label);
      })
      .map((x: any) => x.it);
  }, [category.items, docsByPermalink]);

  return (
    <>
      <PageMetadata
        title={categoryGeneratedIndex.title}
        description={categoryGeneratedIndex.description}
        image={imageUrl}
      />

      <div className={styles.container}>
        <DocBreadcrumbs />

        <header className={styles.header}>
          <Heading as="h1" className={styles.title}>
            {categoryGeneratedIndex.title}
          </Heading>
          {categoryGeneratedIndex.description && (
            <p className={styles.description}>
              {categoryGeneratedIndex.description}
            </p>
          )}
          <p className={styles.stats}>共 {category.items.length} 个条目</p>
        </header>

        <ul className={styles.list}>
          {sortedItems.map((it: any) => {
            const href = it?.href ?? it?.to ?? undefined;
            const title = it?.label ?? it?.title ?? "";
            const meta = href ? docsByPermalink.get(href) : undefined;
            const desc = meta?.description ?? it?.description ?? "";
            const updatedTs: number | string | undefined =
              meta?.lastUpdatedAt ?? meta?.date ?? undefined;
            const dateObj = updatedTs ? new Date(updatedTs as any) : undefined;
            const updatedIso = dateObj ? dateObj.toISOString() : undefined;
            const updatedLabel = dateObj
              ? dateObj.toLocaleDateString()
              : undefined;

            return (
              <li key={href ?? title} className={styles.listItem}>
                <h3 className={styles.itemTitle}>
                  <a href={href}>{title}</a>
                  {Array.isArray((it as any)?.items) &&
                    (it as any).items.length > 0 && (
                      <span
                        className={styles.itemCountTag}
                        aria-label={`子项数量：${(it as any).items.length}`}
                      >
                        {(it as any).items.length} 项
                      </span>
                    )}
                </h3>
                {updatedIso && updatedLabel && (
                  <div className={styles.meta}>
                    <time className={styles.itemTime} dateTime={updatedIso}>
                      {updatedLabel}
                    </time>
                  </div>
                )}
                {desc && <p className={styles.itemDesc}>{desc}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
