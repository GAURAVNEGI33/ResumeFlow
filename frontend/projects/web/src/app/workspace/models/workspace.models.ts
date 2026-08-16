export type DocumentType = 'resume' | 'cv' | 'cover_letter';
export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface TemplateRecord {
  id: number;
  name: string;
  config?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentRecord {
  id: number;
  title: string;
  type: DocumentType;
  templateId?: number | null;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  Template?: Pick<TemplateRecord, 'name'>;
}

export interface ItemRecord {
  id: number;
  sectionId: number;
  content: string;
  position: number;
}

export interface SectionRecord {
  id: number;
  documentId: number;
  heading: string;
  position: number;
  isSidebar: boolean;
  items?: ItemRecord[];
}

export interface ApplicationRecord {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  documentId?: number | null;
  updatedAt?: string;
  Document?: Pick<DocumentRecord, 'id' | 'title'>;
}

export interface ShareRecord {
  id: number;
  slug: string;
  documentId: number;
  createdAt?: string;
  documentTitle?: string;
}

export interface VersionRecord {
  id: number;
  label: string;
  snapshot: string;
  documentId: number;
  createdAt?: string;
}
