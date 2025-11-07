import fetchContentType from "@/lib/strapi/fetchContentType";
import ClientSlugHandler from "../ClientSlugHandler";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/types";
import NewsPagination from "@/components/NewsPagination";
import Hero from "@/components/Hero";
import type { Metadata } from "next";

type NewsIndexParams = {
  locale: string;
};

type NewsIndexSearchParams = {
  page?: string;
};

interface NewsIndexProps {
  // Match Next's PageProps constraint
  params: Promise<NewsIndexParams>;
  searchParams?: Promise<NewsIndexSearchParams>;
}

export default async function NewsIndex({
  params,
  searchParams,
}: NewsIndexProps) {
  const { locale } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const currentPage = parseInt(resolvedSearch.page || "1", 10);
  const articlesPerPage = 9; // 3x3 grid

  const articlesResponse = await fetchContentType("articles", {
    populate: {
      image: {
        populate: "*",
      },
      categories: {
        populate: "*",
      },
    },
    locale: locale,
    sort: ["publishedAt:desc"],
    pagination: {
      page: currentPage,
      pageSize: articlesPerPage,
    },
  });

  const articles: Article[] = articlesResponse?.data || [];
  const pagination =
    articlesResponse?.meta?.pagination || {
      page: 1,
      pageSize: articlesPerPage,
      pageCount: 1,
      total: 0,
    };

  const formatDate = (dateString: string, locale: string) => {
    const isEnglish = locale === "en";
    return new Date(dateString).toLocaleDateString(
      isEnglish ? "en-US" : "fr-FR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getTexts = (locale: string) => {
    return locale === "en"
      ? {
          title: "News",
          subtitle: "Discover our latest articles and news",
          noArticles: "No articles available at the moment.",
        }
      : {
          title: "Actualités",
          subtitle: "Découvrez nos derniers articles et actualités",
          noArticles: "Aucun article disponible pour le moment.",
        };
  };

  const texts = getTexts(locale);

  return (
    <main className="min-h-screen">
      <ClientSlugHandler
        localizedSlugs={{
          en: "news",
          fr: "news",
        }}
      />

      {/* Hero Section */}
      <Hero title={texts.title} description={texts.subtitle} size="lg" />

      {/* Articles Section */}
      <section className="container mx-auto py-12 max-w-6xl px-4">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {texts.noArticles}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.slug} className="group">
                  <Link href={`/${locale}/news/${article.slug}`} className="block">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-105">
                      {/* Article image */}
                      {article.image && (
                        <div className="relative w-full h-48">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${article.image.url}`}
                            alt={article.image.alternativeText || article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Categories */}
                        {article.categories && article.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.categories.slice(0, 2).map((category, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Published date */}
                        <time
                          dateTime={article.publishedAt}
                          className="text-sm text-gray-500 dark:text-gray-400"
                        >
                          {formatDate(article.publishedAt, locale)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <NewsPagination
              currentPage={pagination.page}
              totalPages={pagination.pageCount}
              locale={locale}
              baseUrl={`/${locale}/news`}
            />
          </>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata(
  { params, searchParams }: NewsIndexProps
): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  void resolvedSearch; // not used but keeps signature aligned

  const getMetadata = (locale: string) => {
    return locale === "en"
      ? {
          title: "News",
          description: "Discover our latest articles and news",
        }
      : {
          title: "Actualités",
          description: "Découvrez nos derniers articles et actualités",
        };
  };

  const metadata = getMetadata(locale);

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    },
  };
}
