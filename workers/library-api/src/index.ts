
interface Env {
  HIIC_LIBRARY: R2Bucket;
}

interface JournalIssueMeta {
  title: string;
  issueNumber: string;
  publishDate: string;
  summary: string;
  keyTakeaways: string[];
  tags?: string[];
  relatedReport?: {
    title: string;
    url: string;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS configuration
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Catalog Endpoint
      if (url.pathname === '/api/library/index') {
        return await handleCatalog(env, corsHeaders);
      }

      // 2. Asset Endpoint
      if (url.pathname.startsWith('/api/library/assets/')) {
        const key = url.pathname.replace('/api/library/assets/', '');
        // Decode the key to handle spaces and special characters correctly
        const decodedKey = decodeURIComponent(key);
        return await handleAsset(env, decodedKey, corsHeaders);
      }

      // 3. Debug Endpoint (Temporary)
      if (url.pathname === '/api/library/debug') {
        // List everything to check if keys are correct
        const listed = await env.HIIC_LIBRARY.list();
        return new Response(JSON.stringify({
          objects: listed.objects.map((o: R2Object) => o.key),
          truncated: listed.truncated,
          bucket_binding_exists: !!env.HIIC_LIBRARY
        }, null, 2), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleCatalog(env: Env, corsHeaders: any) {
  // List all objects in the bucket
  // Note: For production with many files, you'd need pagination.
  // R2 list returns up to 1000 items by default.
  const listed = await env.HIIC_LIBRARY.list({ prefix: 'library/' });

  // Find all meta.json files
  const metaKeys = listed.objects.filter(obj => obj.key.endsWith('/meta.json'));

  // Fetch all meta files in parallel
  const metaPromises = metaKeys.map(async (obj) => {
    const file = await env.HIIC_LIBRARY.get(obj.key);
    if (!file) return null;

    try {
      const json = await file.json() as JournalIssueMeta;

      // Parse path to get metadata from folder structure
      // Structure: library/<sourceId>/<year>/<issueId>/meta.json
      const parts = obj.key.split('/');
      if (parts.length < 4) return null;

      const sourceId = parts[1];
      const issueId = parts[3]; // Uses folder name as issue ID

      // Base path for assets
      const basePath = obj.key.replace('meta.json', '');

      return {
        ...json,
        id: issueId,
        sourceId: sourceId,
        // We provide relative paths that the frontend can append to the asset API URL
        cover: `${basePath}cover.jpg`,
        pdfUrl: `${basePath}document.pdf`
      };
    } catch (e) {
      console.error(`Error parsing ${obj.key}`, e);
      return null;
    }
  });

  const issues = (await Promise.all(metaPromises)).filter(Boolean);

  // Extract unique sources from the issues found
  // In a real app, you might want a separate 'sources.json' or store source metadata in R2
  // For now, we'll derive available sources from the directory structure
  // This means we only show sources that have at least one issue
  const uniqueSourceIds = [...new Set(issues.map(i => i?.sourceId))];

  // We'll return the list of issues.
  // The frontend can continue to use its static source definitions for things like
  // source names/descriptions (which rarely change), OR we could move that to R2 as well.
  // For this implementation, we return issues and let frontend map them to known sources.

  return new Response(JSON.stringify({ issues }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      // Cache for 5 minutes
      'Cache-Control': 'public, max-age=300'
    }
  });
}

async function handleAsset(env: Env, key: string, corsHeaders: any) {
  const object = await env.HIIC_LIBRARY.get(key);

  if (!object) {
    return new Response('File Not Found', { status: 404, headers: corsHeaders });
  }

  const headers = new Headers(corsHeaders);
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  // Set content type based on extension if R2 didn't have it
  if (!headers.has('content-type')) {
    if (key.endsWith('.pdf')) headers.set('content-type', 'application/pdf');
    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) headers.set('content-type', 'image/jpeg');
    if (key.endsWith('.png')) headers.set('content-type', 'image/png');
  }

  // Cache assets for longer (1 day)
  headers.set('Cache-Control', 'public, max-age=86400');

  return new Response(object.body, {
    headers,
  });
}
