import fetchContentType from "@/lib/strapi/fetchContentType";
import Hero from "@/components/Hero";
import TeamsList from "@/components/teams/TeamsList";
import ClientSlugHandler from "../ClientSlugHandler";
import { ResearchTeam } from "@/types/types";

type TeamsIndexParams = {
  locale: string;
};

interface TeamsIndexProps {
  // Match Next's PageProps constraint
  params: Promise<TeamsIndexParams>;
}

export default async function TeamsIndex({ params }: TeamsIndexProps) {
  const { locale } = await params;

  const res = await fetchContentType("teams", {
    populate: {
      team_leader: { populate: "*" },
      members: { populate: "*" },
      projects: { populate: "*" },
      localizations: { populate: "*" },
    },
    locale,
    pagination: { page: 1, pageSize: 500 },
  });

  const teams: ResearchTeam[] = res?.data || [];

  const texts =
    locale === "en"
      ? {
          title: "Research Teams",
          subtitle: "Discover our teams and their projects",
        }
      : {
          title: "Équipes de recherche",
          subtitle: "Découvrez nos équipes et leurs projets",
        };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={{ en: "teams", fr: "teams" }} />
      <Hero title={texts.title} description={texts.subtitle} size="lg" />
      <TeamsList teams={teams} locale={locale} />
    </main>
  );
}
