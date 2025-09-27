'use client';

import Image from 'next/image';
import { DirectorWord as DirectorWordType } from '@/types/types';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface DirectorWordProps {
  directorWord: DirectorWordType;
  locale: string;
}

export default function DirectorWord({ directorWord, locale }: DirectorWordProps) {
  if (!directorWord || !directorWord.director) {
    return null;
  }

  const { word, director } = directorWord;


  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Director Word Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Director Image */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg">
                  {director.image?.url ? (
                    <Image
                      src={strapiImage(director.image.url)}
                      alt={`${director.firstName} ${director.lastName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl md:text-3xl font-bold">
                        {director.firstName?.[0]?.toUpperCase()}{director.lastName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Director Name & Title */}
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {director.firstName} {director.lastName}
                  </h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                    {locale === 'en' ? "Laboratory's Director" : 'Directeur du laboratoire'}
                  </p>
                </div>

                {/* Director's Word */}
                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                  <p className="text-lg leading-relaxed italic">
                    "{word}"
                  </p>
                </div>

                {/* Bouton Lire Plus supprimé */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
