import fetchContentType from './fetchContentType';
import { Project } from '@/types/types';

export async function fetchProjectBySlug(slug: string, locale: string): Promise<Project | null> {
  try {
    const response = await fetchContentType('projects', {
      filters: { slug: { $eq: slug } },
      populate: {
        project_manager: { populate: '*' },
        research_team: { populate: '*' },
        localizations: { populate: '*' }
      },
      locale
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as Project;
    }

    return null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

export default fetchProjectBySlug;

