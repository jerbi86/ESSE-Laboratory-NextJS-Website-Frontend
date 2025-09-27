'use client';

import { Event } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CKEditorContent from '@/components/CKEditorContent';

interface EventDetailProps {
  event: Event;
  locale: string;
}

export default function EventDetail({ event, locale }: EventDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return null;
    return timeString;
  };

  const isPastEvent = new Date(event.date) < new Date();

  // Description pour le hero basée sur les informations de l'événement
  const heroDescription = `${formatDate(event.date)}${event.time ? ` • ${event.time}` : ''}${event.localisation ? ` • ${event.localisation.name}` : ''}`;

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title={event.title}
        description={heroDescription}
        size="lg"
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation retour */}
        <div className="mb-6">
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            {locale === 'fr' ? 'Retour aux événements' : 'Back to events'}
          </Link>
        </div>

        {/* Contenu principal de l'événement */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge variant={isPastEvent ? "secondary" : "default"} className="text-sm">
                  {isPastEvent
                    ? (locale === 'fr' ? 'Événement passé' : 'Past Event')
                    : (locale === 'fr' ? 'Événement à venir' : 'Upcoming Event')
                  }
                </Badge>
              </div>
              {event.url && (
                <Button asChild variant="outline">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    {locale === 'fr' ? 'Lien externe' : 'External Link'}
                  </a>
                </Button>
              )}
            </div>

            {/* Informations détaillées de l'événement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Calendar size={20} className="mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">
                      {locale === 'fr' ? 'Date' : 'Date'}
                    </div>
                    <div className="text-lg">{formatDate(event.date)}</div>
                  </div>
                </div>
                {event.time && (
                  <div className="flex items-center text-gray-700">
                    <Clock size={20} className="mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        {locale === 'fr' ? 'Heure' : 'Time'}
                      </div>
                      <div className="text-lg">{formatTime(event.time)}</div>
                    </div>
                  </div>
                )}
              </div>
              {event.localisation && (
                <div className="flex items-start text-gray-700">
                  <MapPin size={20} className="mr-3 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium mb-1">
                      {locale === 'fr' ? 'Lieu' : 'Location'}
                    </div>
                    <div className="text-lg font-medium">{event.localisation.name}</div>
                    {event.localisation.address && (
                      <div className="text-gray-600 mt-1">{event.localisation.address}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contenu de l'événement */}
            {event.content && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {locale === 'fr' ? 'Description' : 'Description'}
                </h2>
                <CKEditorContent content={event.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
