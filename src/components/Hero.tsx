import React from 'react';

interface HeroProps {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Hero({ title, description, size = 'lg', className = '' }: HeroProps) {
  const sizeClasses = {
    sm: 'py-20 md:py-24',
    md: 'py-24 md:py-32',
    lg: 'py-32 md:py-40 lg:py-48'
  };

  const titleSizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl lg:text-5xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl'
  };

  return (
    <section className={`bg-gray-50 dark:bg-gray-900 ${sizeClasses[size]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`${titleSizeClasses[size]} font-bold text-gray-900 dark:text-white mb-4`}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
