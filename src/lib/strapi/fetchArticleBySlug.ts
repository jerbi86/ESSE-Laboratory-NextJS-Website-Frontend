import fetchContentType from './fetchContentType';
import { Article } from '@/types/types';

/**
 * Fetches a single article by slug from Strapi
 * @param slug - The article slug
 * @param locale - The locale for the article
 * @returns Promise<Article | null>
 */
export async function fetchArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  try {
    const response = await fetchContentType('articles', {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: {
        image: {
          populate: '*'
        },
        categories: {
          populate: '*'
        },
        seo: {
          populate: '*'
        },
        localizations: {
          populate: '*'
        }
      },
      locale: locale
    });

    if (response?.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}
