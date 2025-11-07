import fetchContentType from "@/lib/strapi/fetchContentType";
import Hero from "@/components/Hero";
import ClientSlugHandler from "../ClientSlugHandler";
import EventsList from "@/components/events/EventsList";
import { Event } from "@/types/types";

interface EventsIndexParams {
  locale: string;
}

interface EventsIndexProps {
  // TS: match the PageProps constraint (params: Promise<any>)
  params: Promise<EventsIndexParams>;
}

export default async function EventsIndex({ params }: EventsIndexProps) {
  const { locale } = await params;

  const res = await fetchContentType("events", {
    populate: {
      localisation: { populate: "*" },
      localizations: { populate: "*" },
    },
    locale,
    pagination: { page: 1, pageSize: 500 },
  });

  const events: Event[] = res?.data || [];

  const texts =
    locale === "en"
      ? {
          title: "Events",
          subtitle: "Discover all our upcoming and past events",
        }
      : {
          title: "Événements",
          subtitle: "Découvrez tous nos événements à venir et passés",
        };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={{ en: "events", fr: "events" }} />

      <Hero title={texts.title} description={texts.subtitle} size="lg" />

      <EventsList events={events} locale={locale} />
    </main>
  );
}
