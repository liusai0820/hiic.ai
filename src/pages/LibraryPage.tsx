import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JournalLayout } from '../components/library/JournalLayout';
import { Grid } from '../components/library/Grid';
import { JournalReader } from '../components/library/JournalReader';
import { journalSources } from '../data';
import { fetchLibraryCatalog } from '../services/library';
import type { JournalIssue } from '../types';

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active source from URL or default to first one
  const sourceIdParam = searchParams.get('source');
  const initialSourceId = sourceIdParam && journalSources.find(s => s.id === sourceIdParam)
    ? sourceIdParam
    : journalSources[0].id;

  const [activeSourceId, setActiveSourceId] = useState(initialSourceId);
  const [readingIssue, setReadingIssue] = useState<JournalIssue | null>(null);

  // Data state
  const [allIssues, setAllIssues] = useState<JournalIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch issues on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const issues = await fetchLibraryCatalog();
        setAllIssues(issues);
        setError(null);
      } catch (err) {
        console.error('Failed to load library data:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update URL when source changes
  useEffect(() => {
    if (activeSourceId) {
      setSearchParams(prev => {
        prev.set('source', activeSourceId);
        return prev;
      });
    }
  }, [activeSourceId, setSearchParams]);

  const activeSource = journalSources.find(s => s.id === activeSourceId) || journalSources[0];

  // Filter issues for the active source and sort by date (newest first)
  const activeIssues = useMemo(() => {
    return allIssues
      .filter(i => i.sourceId === activeSourceId)
      .sort((a, b) => {
        // Sort by publishDate descending (newest first)
        return b.publishDate.localeCompare(a.publishDate);
      });
  }, [allIssues, activeSourceId]);

  const handleSourceSelect = (id: string) => {
    setActiveSourceId(id);
    setReadingIssue(null);
  };

  return (
    <>
      <JournalLayout activeSourceId={activeSourceId} onSourceSelect={handleSourceSelect}>
        <Grid
          source={activeSource}
          issues={activeIssues}
          loading={loading}
          error={error}
          onIssueClick={setReadingIssue}
        />
      </JournalLayout>

      {readingIssue && (
        <JournalReader
          issue={readingIssue}
          onClose={() => setReadingIssue(null)}
        />
      )}
    </>
  );
}
