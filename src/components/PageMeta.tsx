import { useEffect } from 'react';
import { siteConfig } from '../content/portal';

export type JsonLdObject = Record<string, unknown>;

interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  jsonLd?: JsonLdObject;
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteConfig.baseUrl}${normalizedPath}`;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonical(canonicalUrl: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', canonicalUrl);
}

function upsertJsonLd(jsonLd: JsonLdObject | undefined): void {
  const scriptId = 'page-meta-json-ld';
  const existing = document.getElementById(scriptId);

  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('script');
  element.id = scriptId;
  element.setAttribute('type', 'application/ld+json');
  element.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(element);
  }
}

export function PageMeta({ title, description, canonicalPath, image, jsonLd }: PageMetaProps) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(canonicalPath);
    const previewImage = image ? absoluteUrl(image) : undefined;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('name', 'twitter:card', previewImage ? 'summary_large_image' : 'summary');

    if (previewImage) {
      upsertMeta('property', 'og:image', previewImage);
      upsertMeta('name', 'twitter:image', previewImage);
    }

    upsertCanonical(canonicalUrl);
    upsertJsonLd(jsonLd);
  }, [canonicalPath, description, image, jsonLd, title]);

  return null;
}
