import fetchContentType from "@/lib/strapi/fetchContentType";
import ClientSlugHandler from './ClientSlugHandler';
import NewsCarousel from '@/components/news/NewsCarousel';
import HomeHero from '@/components/HomeHero';
import { Article, PartnersResponse, DirectorWord as DirectorWordType, HomePage } from '@/types/types';
import YouTubeChannel from '@/components/youtube/YouTubeChannel';
import Partners from '@/components/partners/Partners';
import DirectorWord from '@/components/director/DirectorWord';
import Statistics from '@/components/statistics/Statistics';

export default async function Home({ params }: { params: { locale: string } }) {
    const { locale } = await params

    // Fetch homepage content with background image and buttons
    const homePage: HomePage = await fetchContentType('home-page', {
        populate: {
            background: {
                populate: '*'
            },
            firstButton: true,
            secondButton: true
        },
        locale: locale
    }, true);

    // Fetch latest news articles for carousel
    const articlesResponse = await fetchContentType('articles', {
        populate: {
            image: {
                populate: '*'
            },
            categories: {
                populate: '*'
            }
        },
        locale: locale,
        sort: ['publishedAt:desc'],
        pagination: {
            page: 1,
            pageSize: 6 // Show 6 latest articles in carousel
        }
    });

    // Fetch partners data (keep wrapper -> spreadData=false)
    const partnersResponse: PartnersResponse = await fetchContentType('partner', {
        populate: {
            partner: {
                populate: {
                    logo: {
                        populate: {
                            image: {
                                populate: '*'
                            }
                        }
                    }
                }
            }
        }
    });

    // Fetch YouTube channel (single type)
    const youtube = await fetchContentType('youtube-channel', {
        populate: '*'
    }, true);

    // Fetch director word (return direct data -> spreadData=true)
    const directorWordResponse = await fetchContentType('director-word', {
        populate: {
            director: {
                populate: {
                    image: {
                        populate: '*'
                    }
                }
            }
        },
        locale: locale
    }, true);

    const directorWord: DirectorWordType = directorWordResponse as DirectorWordType;

    // Fetch statistics data
    const [membersResponse, publicationsResponse, projectsResponse, teamsResponse] = await Promise.all([
        fetchContentType('user-profiles', { locale }),
        fetchContentType('publications', {populate: '*'}),
        fetchContentType('projects', { locale }),
        fetchContentType('teams', { locale })
    ]);

    // Extract counts
    const membersCount = Array.isArray(membersResponse?.data) ? membersResponse.data.length : 0;
    const publicationsCount = Array.isArray(publicationsResponse?.data) ? publicationsResponse.data.length : 0;
    const projectsCount = Array.isArray(projectsResponse?.data) ? projectsResponse.data.length : 0;
    const teamsCount = Array.isArray(teamsResponse?.data) ? teamsResponse.data.length : 0;

    const articles: Article[] = articlesResponse?.data || [];

    const localizedSlugs = homePage.localizations?.reduce(
        (acc: Record<string, string>, localization: any) => {
            acc[localization.locale] = "";
            return acc;
        },
        { [params.locale]: "" }
    );

    return (
        <main className="min-h-screen">
            <ClientSlugHandler localizedSlugs={localizedSlugs} />

            {/* Hero Section */}
            <HomeHero homePage={homePage} locale={locale} />

            {/* Latest News Carousel */}
            <NewsCarousel articles={articles} locale={locale} />

            {/* Director's Word Section */}
            {directorWord && (
                <DirectorWord directorWord={directorWord} locale={locale} />
            )}

            {/* Statistics Section */}
            <Statistics
                membersCount={membersCount}
                publicationsCount={publicationsCount}
                projectsCount={projectsCount}
                teamsCount={teamsCount}
                locale={locale}
            />

            {/* YouTube Channel Section */}
            <YouTubeChannel channelUrl={youtube?.channel_url} videos={youtube?.videos || []} />

            {/* Partners Section */}
            <Partners partners={partnersResponse?.data?.partner || []} locale={locale} />

        </main>
    );
}
