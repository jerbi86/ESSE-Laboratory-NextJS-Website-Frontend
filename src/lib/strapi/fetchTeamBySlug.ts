import fetchContentType from './fetchContentType';
import { ResearchTeam } from '@/types/types';

export async function fetchTeamBySlug(slug: string, locale: string): Promise<ResearchTeam | null> {
  try {
    const response = await fetchContentType('teams', {
      filters: { slug: { $eq: slug } },
      populate: {
        team_leader: { populate: '*' },
        members: { populate: '*' },
        projects: { populate: '*' },
        localizations: { populate: '*' }
      },
      locale
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as ResearchTeam;
    }

    return null;
  } catch (error) {
    console.error('Error fetching team by slug:', error);
    return null;
  }
}

export default fetchTeamBySlug;

