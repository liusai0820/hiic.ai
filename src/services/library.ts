import type { JournalIssue } from '../types';
import { journalIssues as staticIssues } from '../data';

const WORKER_API_URL = import.meta.env.VITE_LIBRARY_API_URL || 'http://localhost:8787/api/library';

interface LibraryCatalogResponse {
  issues: JournalIssue[];
}

export async function fetchLibraryCatalog(): Promise<JournalIssue[]> {
  try {
    const response = await fetch(`${WORKER_API_URL}/index`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json() as LibraryCatalogResponse;
    return data.issues.map(issue => ({
      ...issue,
      // Ensure assets point to the worker endpoint
      cover: getAssetUrl(issue.cover),
      pdfUrl: issue.pdfUrl ? getAssetUrl(issue.pdfUrl) : undefined
    }));
  } catch (error) {
    console.warn('Failed to fetch library catalog, falling back to static data', error);
    // Fallback to static data for development/demo if API fails
    return staticIssues;
  }
}

export function getAssetUrl(path: string): string {
  if (path.startsWith('http')) return path;
  // Construct absolute URL for worker assets
  // Encode the path components to handle special characters correctly
  const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${WORKER_API_URL}/assets/${encodedPath}`;
}
