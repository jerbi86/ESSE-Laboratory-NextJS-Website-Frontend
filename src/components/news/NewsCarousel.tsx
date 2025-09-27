"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types/types';

interface NewsCarouselProps {
  articles: Article[];
  locale: string;
}

const NewsCarousel = ({ articles, locale }: NewsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  const formatDate = (dateString: string, locale: string) => {
    const isEnglish = locale === 'en';
    return new Date(dateString).toLocaleDateString(isEnglish ? 'en-US' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTexts = (locale: string) => {
    return locale === 'en'
      ? {
          title: 'Latest News',
          readMore: 'Read more'
        }
      : {
          title: 'Dernières actualités',
          readMore: 'Lire la suite'
        };
  };

  const texts = getTexts(locale);

  if (!articles || articles.length === 0) {
    return null;
  }

  // Show only 3 articles at a time, but slide one by one
  const visibleArticles = articles.slice(currentIndex, currentIndex + 3);
  const canGoNext = currentIndex + 3 < articles.length;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setAnimationKey(prev => prev + 1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setAnimationKey(prev => prev + 1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const ArticleCard = ({ article, isMobile = false }: { article: Article; isMobile?: boolean }) => (
    <Link href={`/${locale}/news/${article.slug}`} className="block h-full group">
      <div className={`relative h-full flex flex-col transition-all duration-300 group-hover:scale-105 group-hover:z-20 group-hover:shadow-2xl shadow-md will-change-transform transform-gpu bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${isMobile ? '' : ''}`}>
        {/* Image */}
        {article.image && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${article.image.url}`}
              alt={article.image.alternativeText || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
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
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
            {article.description}
          </p>

          {/* Date */}
          <div className="flex items-center justify-between mt-auto">
            <time
              dateTime={article.publishedAt}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {formatDate(article.publishedAt, locale)}
            </time>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
              {texts.readMore}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {texts.title}
          </h2>
        </div>

        {/* Mobile Carousel (scroll-based) */}
        <div className="block md:hidden overflow-visible">
          <div className="flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-px-4 px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            {articles.map((article) => (
              <div key={article.slug} className="snap-start shrink-0 w-[85vw] max-w-sm overflow-visible">
                <div className="p-2">
                  <ArticleCard article={article} isMobile={true} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Carousel - Show only 3 items */}
        <div className="hidden md:block relative overflow-visible">
          <div className="relative px-16">
            <div
              key={animationKey}
              className="grid grid-cols-3 gap-6 animate-in slide-in-from-right-5 duration-500"
            >
              {visibleArticles.map((article) => (
                <div key={article.slug} className="h-full">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            {canGoPrev && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {canGoNext && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
