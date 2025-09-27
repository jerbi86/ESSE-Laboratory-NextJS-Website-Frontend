'use client';

import { Event } from '@/types/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

interface EventCardProps {
  event: Event;
  locale: string;
}

export default function EventCard({ event, locale }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return null;
    return timeString;
  };

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isPastEvent ? "secondary" : "default"}>
                {isPastEvent 
                  ? (locale === 'fr' ? 'Passé' : 'Past')
                  : (locale === 'fr' ? 'À venir' : 'Upcoming')
                }
              </Badge>
            </div>
            <Link 
              href={`/${locale}/events/${event.slug}`}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
            >
              {event.title}
            </Link>
          </div>
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.date)}</span>
            {event.time && (
              <>
                <Clock size={16} className="ml-4 mr-2" />
                <span>{formatTime(event.time)}</span>
              </>
            )}
          </div>
          {event.localisation && (
            <div className="flex items-start text-gray-600">
              <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">{event.localisation.name}</div>
                {event.localisation.address && (
                  <div className="text-sm text-gray-500">{event.localisation.address}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {event.content && (
          <div 
            className="text-gray-700 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: event.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
            }}
          />
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/${locale}/events/${event.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            {locale === 'fr' ? 'Lire plus →' : 'Read more →'}
          </Link>
        </div>
      </div>
    </div>
  );
}
