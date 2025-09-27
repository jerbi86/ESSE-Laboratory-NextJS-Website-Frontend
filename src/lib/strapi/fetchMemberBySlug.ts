import fetchContentType from './fetchContentType';
import { MemberProfile } from '@/types/types';

export async function fetchMemberBySlug(slug: string, locale: string): Promise<MemberProfile | null> {
  try {
    const response = await fetchContentType('user-profiles', {
      filters: { slug: { $eq: slug } },
      populate: {
        image: { populate: '*' },
        members_roles: { populate: '*' },
        publications: {
          populate: {
            type: { populate: '*' },
            members: { populate: '*' },
            non_members: { populate: '*' },
            publisher: { populate: '*' },
            attachements: {
              populate: '*'
            }
          }
        },
        localizations: { populate: '*' }
      },
      locale
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as MemberProfile;
    }

    return null;
  } catch (error) {
    console.error('Error fetching member by slug:', error);
    return null;
  }
}

export default fetchMemberBySlug;
