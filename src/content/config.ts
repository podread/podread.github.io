import { defineCollection, z } from 'astro:content';

const episodeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    podcast: z.string(),
    podcast_slug: z.string(),
    episode_slug: z.string(),
    episode_url: z.string().url(),
    summary: z.string().optional(),
    transcript_source: z.string().optional(),
    source_language: z.string().default('en'),
    article_language: z.string().default('zh-CN'),
    content_type: z.enum(['full_translation', 'summary', 'commentary', 'digest']).default('summary'),
    rights_status: z.enum(['local_only', 'public_summary_only', 'public_full_authorized']),
    published_at: z.coerce.date(),
    tags: z.array(z.string()).default([])
  })
});

const showCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    website: z.string().url().optional()
  })
});

export const collections = {
  episodes: episodeCollection,
  shows: showCollection
};
