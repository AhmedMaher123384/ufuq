export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryWithProducts extends Category {
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price: number;
  image: string;
  categoryId: number;
  isActive?: boolean;
}

export type CategoryFormType = 'website' | 'app' | 'general';

export interface FormSubmissionData {
  formType: CategoryFormType;
  categoryId: number;
  categoryName: string;
  categoryNameAr?: string;
  fullName: string;
  phone: string;
  documentType?: string;
  siteType?: string;
  ecommercePlatform?: string;
  existingUrl?: string;
  serviceType?: string;
  appType?: string;
  requestDetails?: string;
  extraInfo?: string;
}