import fetchContentType from './fetchContentType';
import { Recruitment } from '@/types/types';

export async function fetchRecruitmentBySlug(slug: string, locale: string): Promise<Recruitment | null> {
  try {
    const response = await fetchContentType('recruitments', {
      filters: { slug: { $eq: slug } },
      populate: {
        recruitments_types: { populate: '*' },
        localizations: { populate: '*' }
      },
      locale
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as Recruitment;
    }
    return null;
  } catch (e) {
    console.error('Error fetching recruitment by slug', e);
    return null;
  }
}

export default fetchRecruitmentBySlug;

