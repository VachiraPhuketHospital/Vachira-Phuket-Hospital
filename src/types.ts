export interface DrugItem {
  id: string;
  genericName: string;
  tradeName: string;
  category: string;
  dosageForm: string;
  strength: string;
  indications: string;
  usageInstructions: string;
  precautions: string;
  contraindications: string;
  storage: string;
  adverseEffects: string;
  interactions: string;
  inHospitalList: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  category: string;
  views: number;
  published: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  icon: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export interface StepInfographic {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  steps: string[];
}

export interface DocumentDownload {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileSize: string;
  fileType: string;
  downloads: number;
  date: string;
  url: string;
  fileName?: string;
  fileData?: string; // Data URL / Base64 for actual download
  isExternalLink?: boolean;
}

export interface QueueItem {
  queueNumber: string;
  hn: string;
  patientName: string;
  room: string;
  status: 'waiting_check' | 'dispensing' | 'ready' | 'completed';
  statusText: string;
  estimatedWaitMinutes: number;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'pharmacist' | 'staff';
  department: string;
  email: string;
  lastLogin: string;
}

export interface PharmacistConsultationItem {
  id: string;
  patientName: string;
  phone: string;
  drugName?: string;
  category?: string;
  question: string;
  status: 'pending' | 'in_progress' | 'answered';
  createdAt: string;
  isRead?: boolean;
  answeredBy?: string;
  answeredAt?: string;
  pharmacistNotes?: string;
}

export interface BannerConfig {
  headline: string;
  subheadline: string;
  hospitalName: string;
  vision: string;
  badgeText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export type PublicNavSection =
  | 'home'
  | 'drugs_all'
  | 'drugs_search'
  | 'drugs_usage'
  | 'drugs_warning'
  | 'drugs_interactions'
  | 'safe_rdu'
  | 'safe_allergy'
  | 'safe_adr'
  | 'services_opd'
  | 'services_ipd'
  | 'services_care'
  | 'services_refill'
  | 'knowledge'
  | 'news'
  | 'documents'
  | 'contact'
  | (string & {});

export type AdminSection =
  | 'dashboard'
  | 'queues'
  | 'consultations'
  | 'menu_topics'
  | 'drugs'
  | 'services'
  | 'knowledge'
  | 'news'
  | 'documents'
  | 'banner'
  | 'infographics'
  | 'users'
  | 'stats'
  | 'settings';

export type Language = 'th' | 'en';
