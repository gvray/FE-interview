// Ambient module declarations to satisfy TypeScript editor for Docusaurus runtime modules
// These modules exist at runtime; we provide minimal typings for a smooth DX.

declare module '@docusaurus/theme-common' {
  export const PageMetadata: React.ComponentType<{
    title?: string;
    description?: string;
    image?: string;
  }>;
  export function useCurrentSidebarCategory(): any;
}

declare module '@docusaurus/plugin-content-docs/client' {
  export function useAllDocsData(): any;
}

declare module '@docusaurus/useBaseUrl' {
  export default function useBaseUrl(path?: string): string;
}

declare module '@theme/DocBreadcrumbs' {
  const DocBreadcrumbs: React.ComponentType<any>;
  export default DocBreadcrumbs;
}

declare module '@theme/DocVersionBanner' {
  const DocVersionBanner: React.ComponentType<any>;
  export default DocVersionBanner;
}

declare module '@theme/DocVersionBadge' {
  const DocVersionBadge: React.ComponentType<any>;
  export default DocVersionBadge;
}

declare module '@theme/Heading' {
  const Heading: React.ComponentType<any>;
  export default Heading;
}

declare module '@theme/DocCategoryGeneratedIndexPage' {
  export type Props = {
    categoryGeneratedIndex: {
      title: string;
      description?: string;
      image?: string;
    };
  };
}