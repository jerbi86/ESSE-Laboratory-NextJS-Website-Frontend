import fetchContentType from './fetchContentType';
import { Event } from '@/types/types';

export async function fetchEventBySlug(slug: string, locale: string): Promise<Event | null> {
  try {
    const response = await fetchContentType('events', {
      filters: { slug: { $eq: slug } },
      populate: {
        localisation: { populate: '*' },
        localizations: { populate: '*' }
      },
      locale
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as Event;
    }

    return null;
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }
}

export default fetchEventBySlug;
