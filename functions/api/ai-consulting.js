export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = '/api/ai-news';
  return Response.redirect(url.toString(), 308);
}
