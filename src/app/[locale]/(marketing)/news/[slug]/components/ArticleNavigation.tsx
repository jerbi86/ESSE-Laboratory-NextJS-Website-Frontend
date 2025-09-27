import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticleNavigationProps {
  previousArticle?: {
    title: string;
    slug: string;
  };
  nextArticle?: {
    title: string;
    slug: string;
  };
  locale: string;
}

export default function ArticleNavigation({
  previousArticle,
  nextArticle,
  locale
}: ArticleNavigationProps) {
  const getTexts = (locale: string) => {
    return locale === 'en'
      ? {
          previous: 'Previous article',
          next: 'Next article',
          backToNews: 'Back to News'
        }
      : {
          previous: 'Article précédent',
          next: 'Article suivant',
          backToNews: 'Retour aux actualités'
        };
  };

  const texts = getTexts(locale);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      {/* Bouton retour vers la liste */}
      <div className="mb-8">
        <Link href={`/${locale}/news`}>
          <Button variant="outline" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {texts.backToNews}
          </Button>
        </Link>
      </div>

      {/* Navigation entre articles */}
      {(previousArticle || nextArticle) && (
        <nav className="flex justify-between items-center">
          <div className="flex-1">
            {previousArticle && (
              <Link
                href={`/${locale}/news/${previousArticle.slug}`}
                className="group block"
              >
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {texts.previous}
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {previousArticle.title}
                </div>
              </Link>
            )}
          </div>

          <div className="flex-1 text-right">
            {nextArticle && (
              <Link
                href={`/${locale}/news/${nextArticle.slug}`}
                className="group block"
              >
                <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {texts.next}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {nextArticle.title}
                </div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
