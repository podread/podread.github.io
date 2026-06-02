import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const site = 'https://podread.github.io';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const episodes = (await getCollection('episodes'))
    .filter((episode) => episode.data.rights_status !== 'local_only')
    .sort((a, b) => b.data.published_at.getTime() - a.data.published_at.getTime());

  const items = episodes
    .map((episode) => {
      const path = `/episodes/${episode.data.podcast_slug}/${episode.data.episode_slug}/`;
      const url = `${site}${path}`;
      const description = episode.data.summary || `${episode.data.podcast} 中文文章`;
      return `
    <item>
      <title>${escapeXml(episode.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${episode.data.published_at.toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Podread</title>
    <link>${site}/</link>
    <description>用中文读播客。</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
};
