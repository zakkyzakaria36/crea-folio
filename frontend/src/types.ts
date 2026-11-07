export type CategoryType = 'illustration' | 'video' | 'dataviz';
export type MediaType = 'image' | 'video' | 'pdf' | 'link' | 'embed';
export type OrderStatus = 'pending' | 'reviewed' | 'in_progress' | 'completed' | 'rejected';

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: CategoryType;
  description: string | null;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl: string | null;
  extraData: any | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderCode: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  serviceCategory: CategoryType | 'other';
  projectTitle: string;
  description: string;
  referenceFileUrl: string | null;
  budgetRange: string | null;
  deadline: string | null;
  status: OrderStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    role: string;
  } | null;
}
