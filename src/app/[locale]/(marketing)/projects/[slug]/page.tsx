import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fetchProjectBySlug from "@/lib/strapi/fetchProjectBySlug";
import { Project } from "@/types/types";
import ProjectDetail from "@/components/projects/ProjectDetail";
import Hero from "@/components/Hero";
import ClientSlugHandler from "../../ClientSlugHandler";

type ProjectPageParams = {
  locale: string;
  slug: string;
};

interface ProjectPageProps {
  // Match Next's PageProps constraint
  params: Promise<ProjectPageParams>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const project: Project | null = await fetchProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const localizedSlugs =
    project.localizations?.reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [locale]: slug }
    ) || { [locale]: slug };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Hero title={project.name} size="lg" />
      <ProjectDetail project={project} locale={locale} />
    </main>
  );
}

export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await fetchProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: locale === "en" ? "Project Not Found" : "Projet introuvable",
    };
  }

  return {
    title: project.name,
    description: project.content
      ? project.content.replace(/<[^>]*>/g, "").substring(0, 160)
      : "",
  };
}
