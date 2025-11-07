import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchArticleBySlug } from "@/lib/strapi/fetchArticleBySlug";
import ClientSlugHandler from "../../ClientSlugHandler";
import ArticleContent from "./components/ArticleContent";
import ArticleMeta from "./components/ArticleMeta";
import NewsHero from "@/components/NewsHero";
import { Article } from "@/types/types";

type NewsPageParams = {
  locale: string;
  slug: string;
};

interface NewsPageProps {
  // Match Next's PageProps constraint
  params: Promise<NewsPageParams>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale, slug } = await params;

  const article: Article | null = await fetchArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const localizedSlugs =
    article.localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [locale]: slug }
    ) || { [locale]: slug };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />

      <NewsHero
        title={article.title}
        description={article.description}
        backgroundImage={
          article.image
            ? `${process.env.NEXT_PUBLIC_API_URL}${article.image.url}`
            : undefined
        }
        size="lg"
        overlay={true}
      />

      <section className="container mx-auto py-12 max-w-4xl px-4">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <ArticleMeta article={article} locale={locale} />
          <ArticleContent article={article} />
        </article>
      </section>
    </main>
  );
}

export async function generateMetadata(
  { params }: NewsPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) {
    return {
      title: locale === "en" ? "Article not found" : "Article non trouvé",
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.image ? [article.image.url] : [],
    },
  };
}
