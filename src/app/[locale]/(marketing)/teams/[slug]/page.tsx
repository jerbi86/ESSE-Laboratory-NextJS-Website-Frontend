import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fetchTeamBySlug from "@/lib/strapi/fetchTeamBySlug";
import { ResearchTeam } from "@/types/types";
import TeamDetail from "@/components/teams/TeamDetail";
import Hero from "@/components/Hero";
import ClientSlugHandler from "../../ClientSlugHandler";

type TeamPageParams = {
  locale: string;
  slug: string;
};

interface TeamPageProps {
  // Match Next's PageProps constraint
  params: Promise<TeamPageParams>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale, slug } = await params;
  const team: ResearchTeam | null = await fetchTeamBySlug(slug, locale);

  if (!team) {
    notFound();
  }

  const localizedSlugs =
    team.localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [locale]: slug }
    ) || { [locale]: slug };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Hero title={team.name} size="lg" />
      <TeamDetail team={team} locale={locale} />
    </main>
  );
}

export async function generateMetadata(
  { params }: TeamPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const team = await fetchTeamBySlug(slug, locale);

  if (!team) {
    return {
      title: locale === "en" ? "Team Not Found" : "Équipe introuvable",
    };
  }

  return {
    title: team.name,
    description: team.content
      ? team.content.replace(/<[^>]*>/g, "").substring(0, 160)
      : "",
  };
}
