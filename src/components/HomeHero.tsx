'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HomePage } from '@/types/types';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface HomeHeroProps {
  homePage: HomePage;
  locale: string;
}

export default function HomeHero({ homePage, locale }: HomeHeroProps) {
  if (!homePage) {
    return null;
  }

  const { name, description, background, firstButton, secondButton } = homePage;

  // Get the background image (use the first one if multiple exist)
  const backgroundImage = background && background.length > 0 ? background[0] : null;
  const backgroundUrl = backgroundImage?.formats?.large?.url ||
                       backgroundImage?.formats?.medium?.url ||
                       backgroundImage?.url;

  // Helper function to get target attribute similar to navbar
  const getTargetAttribute = (target?: string | null) => {
    if (!target || target === 'null' || target === 'self') return undefined;
    return target;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={strapiImage(backgroundUrl)}
            alt={backgroundImage?.alternativeText || name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {name}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>

          {/* Dynamic CTA Buttons */}
          {(firstButton || secondButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {firstButton && (
                <Link
                  href={`/${locale}${firstButton.URL}`}
                  target={getTargetAttribute(firstButton.target)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-center"
                >
                  {firstButton.text}
                </Link>
              )}
              {secondButton && (
                <Link
                  href={`/${locale}${secondButton.URL}`}
                  target={getTargetAttribute(secondButton.target)}
                  className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg border-2 border-white transition-colors duration-200 flex items-center justify-center text-center"
                >
                  {secondButton.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
