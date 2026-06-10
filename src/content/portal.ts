import portalContent from '../../content/portal.json';

export type PortalContentKind = 'app' | 'skill' | 'tutorial' | 'insight' | 'report' | 'collection';

export type PortalItemStatus = 'online' | 'planned' | 'published' | 'active';

export interface PortalMetric {
  label: string;
  value: string;
}

export interface PortalAgentMetadata {
  purpose: string;
  inputs: string[];
  outputs: string[];
  access: string;
}

export interface PortalSection {
  heading: string;
  body: string;
}

export interface PortalReference {
  kind: PortalContentKind;
  slug: string;
}

export interface PortalSeo {
  title: string;
  description: string;
}

export interface PortalContentItem {
  kind: PortalContentKind;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  updatedAt: string;
  status: PortalItemStatus;
  cover: string;
  ctaLabel: string;
  ctaUrl: string;
  featured: boolean;
  metrics: PortalMetric[];
  agent: PortalAgentMetadata;
  sections: PortalSection[];
  related: PortalReference[];
  seo: PortalSeo;
}

export interface PortalSiteConfig {
  name: string;
  baseUrl: string;
  description: string;
  language: string;
  organization: string;
}

interface PortalDataset {
  site: PortalSiteConfig;
  items: PortalContentItem[];
}

const portal = portalContent as PortalDataset;

export const siteConfig = portal.site;

export const portalItems = [...portal.items].sort((left, right) => {
  return new Date(right.date).getTime() - new Date(left.date).getTime();
});

export const kindLabels: Record<PortalContentKind, string> = {
  app: 'AI 应用',
  skill: 'Skill',
  tutorial: '教程',
  insight: '资讯观察',
  report: '研究报告',
  collection: '专题集合',
};

export const kindPluralLabels: Record<PortalContentKind, string> = {
  app: 'AI 应用',
  skill: 'AI Skill',
  tutorial: 'AI 教程',
  insight: 'AI 资讯与观察',
  report: '研究报告',
  collection: '专题集合',
};

export const kindRoutes: Record<PortalContentKind, string> = {
  app: '/apps',
  skill: '/skills',
  tutorial: '/tutorials',
  insight: '/insights',
  report: '/reports',
  collection: '/collections',
};

export const statusLabels: Record<PortalItemStatus, string> = {
  online: '已上线',
  planned: '筹备中',
  published: '已发布',
  active: '进行中',
};

export function getItemPath(item: PortalReference | PortalContentItem): string {
  return `${kindRoutes[item.kind]}/${item.slug}`;
}

export function getItemsByKind(kind: PortalContentKind): PortalContentItem[] {
  return portalItems.filter((item) => item.kind === kind);
}

export function getFeaturedItems(kind: PortalContentKind, limit = 6): PortalContentItem[] {
  return getItemsByKind(kind).filter((item) => item.featured).slice(0, limit);
}

export function getPortalItem(kind: PortalContentKind, slug: string): PortalContentItem | undefined {
  return portalItems.find((item) => item.kind === kind && item.slug === slug);
}

export function getRelatedItems(item: PortalContentItem): PortalContentItem[] {
  return item.related
    .map((reference) => getPortalItem(reference.kind, reference.slug))
    .filter((relatedItem): relatedItem is PortalContentItem => Boolean(relatedItem));
}

export function getCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.baseUrl}${normalizedPath}`;
}

export const portalStats = {
  apps: getItemsByKind('app').length,
  skills: getItemsByKind('skill').length,
  tutorials: getItemsByKind('tutorial').length,
  insights: getItemsByKind('insight').length,
  reports: getItemsByKind('report').length,
  collections: getItemsByKind('collection').length,
};
