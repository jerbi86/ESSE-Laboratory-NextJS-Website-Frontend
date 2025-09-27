import React from 'react';

interface NewsHeroProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  className?: string;
}

const NewsHero: React.FC<NewsHeroProps> = ({ 
  title, 
  description, 
  backgroundImage,
  size = 'lg', 
  overlay = true,
  className = '' 
}) => {
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

  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <section 
      className={`relative ${sizeClasses[size]} ${className}`}
      style={backgroundStyle}
    >
      {/* Overlay pour améliorer la lisibilité du texte */}
      {overlay && (
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
      )}
      
      {/* Fallback background si pas d'image */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`${titleSizeClasses[size]} font-bold text-white mb-4 drop-shadow-lg`}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsHero;
