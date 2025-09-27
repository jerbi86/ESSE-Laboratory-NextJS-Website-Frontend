export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
  localizations?: Array<{
    locale: string;
    slug: string;
  }>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
}

export interface MemberRole {
  name: string;
  locale?: string;
}

export interface MediaFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface MediaFile {
  url: string;
}

export interface MemberImage {
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

export interface PublicationType {
  name: string;
}

export interface PublicationPublisher {
  id: number;
  name?: string | null;
  volume?: string | null;
  additionalInformation?: string | null;
  date?: string | null;
}

export interface PublicationAttachment {
  id: number;
  associatedURL?: string | null;
  associatedDoi?: string | null;
  associatedScholar?: string | null;
  associatedPDF?: string | MediaFile | MediaFile[] | null;
}

export interface PublicationMemberRef {
  id: number;
  firstName: string;
  lastName: string;
  slug: string;
}

export interface Publication {
  id: number;
  title: string;
  type?: PublicationType;
  members?: PublicationMemberRef[];
  non_members?: { id: number; fullName: string }[];
  publisher?: PublicationPublisher;
  attachements?: PublicationAttachment;
}

export interface MemberProfile {
  id: number;
  firstName: string;
  lastName: string;
  biography?: string;
  email?: string;
  phone_number?: number | string;
  user_name?: string;
  slug: string;
  locale: string;
  image?: MemberImage;
  members_roles?: MemberRole[];
  publications?: Publication[];
  localizations?: Array<{
    locale: string;
    slug: string;
  }>;
}

export interface Localisation {
  id: number;
  name: string;
  address?: string;
}

export interface Event {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  time?: string | null;
  url?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localisation?: Localisation;
  seo?: any;
  localizations?: Array<{
    id: number;
    documentId: string;
    title: string;
    slug: string;
    locale: string;
    date: string;
    time?: string | null;
    content: string;
    url?: string | null;
  }>;
}

export interface RecruitmentType {
  id: number;
  name: string;
  locale?: string;
}

export interface RecruitmentLocalizationRef {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  locale: string;
}

export interface Recruitment {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  recruitments_types?: RecruitmentType[];
  localizations?: RecruitmentLocalizationRef[];
}

export interface ProjectLocalizationRef {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  locale: string;
}

export interface ResearchTeamRef {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectManagerRef extends PublicationMemberRef {}

export interface Project {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale: string;
  project_manager?: ProjectManagerRef | null;
  research_team?: ResearchTeamRef | ResearchTeam | null;
  localizations?: ProjectLocalizationRef[];
}

export interface TeamLocalizationRef {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  locale: string;
}

export interface ResearchTeam {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale: string;
  team_leader?: MemberProfile | null;
  members?: MemberProfile[];
  projects?: Project[];
  localizations?: TeamLocalizationRef[];
}

export interface Partner {
  id: number;
  link: string;
  logo: {
    id: number;
    documentId: string;
    company: string;
    image: {
      id: number;
      documentId: string;
      name: string;
      alternativeText?: string | null;
      width: number;
      height: number;
      formats?: {
        thumbnail?: MediaFormat;
        small?: MediaFormat;
        medium?: MediaFormat;
        large?: MediaFormat;
      };
      url: string;
    };
  };
}

export interface PartnersResponse {
  data: {
    id: number;
    documentId: string;
    partner: Partner[];
  };
}

export interface DirectorWord {
  id: number;
  documentId: string;
  word: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  director: MemberProfile;
  localizations?: Array<{
    id: number;
    documentId: string;
    word: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
}

export interface BackgroundImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  url: string;
}

export interface Button {
  id: number;
  text: string;
  URL: string;
  target?: string | null;
}

export interface HomePage {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  background?: BackgroundImage[];
  firstButton?: Button;
  secondButton?: Button;
  localizations?: Array<{
    id: number;
    documentId: string;
    name: string;
    description: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
}
