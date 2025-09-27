import { Badge } from '@/components/ui/badge';
import { Article } from '@/types/types';

interface ArticleMetaProps {
  article: Article;
  locale: string;
}

export default function ArticleMeta({ article, locale }: ArticleMetaProps) {
  const formatDate = (dateString: string, locale: string) => {
    const isEnglish = locale === 'en';
    return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPublishedText = (locale: string) => {
    return locale === 'en' ? 'Published on' : 'Publié le';
  };

  const getUpdatedText = (locale: string) => {
    return locale === 'en' ? 'Updated on' : 'Mis à jour le';
  };

  return (
    <header className="mb-8 not-prose">
      {/* Métadonnées */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <time dateTime={article.publishedAt}>
          {getPublishedText(locale)} {formatDate(article.publishedAt, locale)}
        </time>

        {article.updatedAt !== article.publishedAt && (
          <time dateTime={article.updatedAt}>
            {getUpdatedText(locale)} {formatDate(article.updatedAt, locale)}
          </time>
        )}
      </div>

      {/* Catégories */}
      {article.categories && article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.categories.map((category, index) => (
            <Badge key={index} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}
