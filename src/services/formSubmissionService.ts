import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  updateDoc, 
  doc,
  deleteDoc,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';

export interface FormSubmission {
  id?: string;
  formType: 'website' | 'app' | 'general';
  categoryId: number;
  categoryName: string;
  categoryNameAr?: string;
  fullName: string;
  phone: string;
  documentType?: string;
  // Website specific fields
  siteType?: string;
  ecommercePlatform?: string;
  existingUrl?: string;
  serviceType?: string;
  // App specific fields
  appType?: string;
  // General specific fields
  requestDetails?: string;
  // Common fields
  extraInfo?: string;
  // Metadata
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submissionDate: any;
  clientIP?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // Contact tracking
  contactAttempts: number;
  lastContactDate?: any;
  notes: string[];
  // Analytics
  submissionTime: number; // Time taken to submit form in seconds
  formVersion: string;
}

export interface SubmissionAnalytics {
  totalSubmissions: number;
  submissionsByType: {
    website: number;
    app: number;
    general: number;
  };
  submissionsByStatus: {
    new: number;
    contacted: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  submissionsByCategory: Record<string, number>;
  submissionsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  submissionsLast7Days: number;
  submissionsLast30Days: number;
  averageSubmissionTime: number;
  conversionRate: number;
}

class FormSubmissionService {
  private submissionsCollection = collection(db, 'formSubmissions');
  private analyticsCollection = collection(db, 'submissionAnalytics');

  // Submit a new form submission
  async submitForm(submission: Omit<FormSubmission, 'id' | 'submissionDate' | 'status' | 'priority' | 'contactAttempts' | 'notes' | 'submissionTime' | 'formVersion'>): Promise<string> {
    try {
      // Calculate priority based on form data
      const priority = this.calculatePriority(submission);
      
      // Get client info
      const clientInfo = this.getClientInfo();
      
      // Clean submission data - remove undefined values
      const cleanSubmission = Object.fromEntries(
        Object.entries(submission).filter(([_, value]) => value !== undefined)
      ) as Omit<FormSubmission, 'id' | 'submissionDate' | 'status' | 'priority' | 'contactAttempts' | 'notes' | 'submissionTime' | 'formVersion'>;
      
      // Create submission object
      const formSubmission: Omit<FormSubmission, 'id'> = {
        ...cleanSubmission,
        status: 'new',
        priority,
        submissionDate: serverTimestamp(),
        contactAttempts: 0,
        notes: [],
        submissionTime: 0, // Will be calculated on the client side
        formVersion: '1.0',
        ...clientInfo
      };

      // Add to Firestore
      const docRef = await addDoc(this.submissionsCollection, formSubmission);
      
      // Update analytics
      await this.updateAnalytics('add', submission.formType, submission.categoryId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error('Failed to submit form. Please try again.');
    }
  }

  // Delete a submission by ID
  async deleteSubmission(id: string): Promise<void> {
    try {
      const submissionRef = doc(this.submissionsCollection, id);
      await deleteDoc(submissionRef);
      await this.updateAnalytics('remove');
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw new Error('Failed to delete submission.');
    }
  }

  // Subscribe to submissions with optional filtering (real-time)
  subscribeToSubmissions(
    filters: {
      formType?: string;
      status?: string;
      categoryId?: number;
      priority?: string;
      dateFrom?: Date;
      dateTo?: Date;
      limit?: number;
    } = {},
    callback: (submissions: FormSubmission[]) => void
  ): () => void {
    try {
      let q = query(this.submissionsCollection, orderBy('submissionDate', 'desc'));

      const conditions = [];
      
      if (filters.formType) {
        conditions.push(where('formType', '==', filters.formType));
      }
      if (filters.status) {
        conditions.push(where('status', '==', filters.status));
      }
      if (filters.categoryId) {
        conditions.push(where('categoryId', '==', filters.categoryId));
      }
      if (filters.priority) {
        conditions.push(where('priority', '==', filters.priority));
      }
      if (filters.dateFrom) {
        conditions.push(where('submissionDate', '>=', filters.dateFrom));
      }
      if (filters.dateTo) {
        conditions.push(where('submissionDate', '<=', filters.dateTo));
      }

      if (conditions.length > 0) {
        q = query(this.submissionsCollection, ...conditions, orderBy('submissionDate', 'desc'));
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const submissions = querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        } as FormSubmission));
        callback(submissions);
      }, (error: Error) => {
        console.error('Error in submissions snapshot:', error);
        callback([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to submissions:', error);
      callback([]);
      return () => {};
    }
  }

  // Get all submissions with optional filtering (one-time fetch)
  async getSubmissions(filters?: {
    formType?: string;
    status?: string;
    categoryId?: number;
    priority?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<FormSubmission[]> {
    try {
      let q = query(this.submissionsCollection, orderBy('submissionDate', 'desc'));

      if (filters) {
        const conditions = [];
        
        if (filters.formType) {
          conditions.push(where('formType', '==', filters.formType));
        }
        if (filters.status) {
          conditions.push(where('status', '==', filters.status));
        }
        if (filters.categoryId) {
          conditions.push(where('categoryId', '==', filters.categoryId));
        }
        if (filters.priority) {
          conditions.push(where('priority', '==', filters.priority));
        }
        if (filters.dateFrom) {
          conditions.push(where('submissionDate', '>=', filters.dateFrom));
        }
        if (filters.dateTo) {
          conditions.push(where('submissionDate', '<=', filters.dateTo));
        }

        if (conditions.length > 0) {
          q = query(this.submissionsCollection, ...conditions, orderBy('submissionDate', 'desc'));
        }
      }

      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FormSubmission));
    } catch (error) {
      console.error('Error getting submissions:', error);
      throw new Error('Failed to get submissions.');
    }
  }

  // Update submission status
  async updateSubmissionStatus(id: string, status: FormSubmission['status'], notes?: string): Promise<void> {
    try {
      const updateData: any = { status };
      
      if (notes) {
        updateData.notes = [...(await this.getSubmission(id)).notes, notes];
      }

      if (status === 'contacted') {
        updateData.contactAttempts = (await this.getSubmission(id)).contactAttempts + 1;
        updateData.lastContactDate = serverTimestamp();
      }

      await updateDoc(doc(db, 'formSubmissions', id), updateData);
    } catch (error) {
      console.error('Error updating submission:', error);
      throw new Error('Failed to update submission.');
    }
  }

  // Get single submission
  async getSubmission(id: string): Promise<FormSubmission> {
    try {
      const querySnapshot = await getDocs(query(this.submissionsCollection, where('__name__', '==', id)));
      if (querySnapshot.empty) {
        throw new Error('Submission not found');
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FormSubmission;
    } catch (error: any) {
      console.error('Error getting submission:', error);
      throw new Error('Failed to get submission.');
    }
  }

  // Subscribe to analytics (real-time)
  subscribeToAnalytics(callback: (analytics: SubmissionAnalytics | null) => void): () => void {
    try {
      const q = query(this.submissionsCollection, orderBy('submissionDate', 'desc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const submissions = querySnapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        } as FormSubmission));
        
        const analytics: SubmissionAnalytics = {
          totalSubmissions: submissions.length,
          submissionsByType: { website: 0, app: 0, general: 0 },
          submissionsByStatus: { new: 0, contacted: 0, in_progress: 0, completed: 0, cancelled: 0 },
          submissionsByCategory: {},
          submissionsByPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
          submissionsLast7Days: 0,
          submissionsLast30Days: 0,
          averageSubmissionTime: 0,
          conversionRate: 0
        };

        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        submissions.forEach(submission => {
          // Count by type
          analytics.submissionsByType[submission.formType]++;
          
          // Count by status
          analytics.submissionsByStatus[submission.status]++;
          
          // Count by category
          const categoryKey = submission.categoryNameAr || submission.categoryName;
          analytics.submissionsByCategory[categoryKey] = (analytics.submissionsByCategory[categoryKey] || 0) + 1;
          
          // Count by priority
          analytics.submissionsByPriority[submission.priority]++;
          
          // Count recent submissions
          const submissionDate = submission.submissionDate?.toDate ? submission.submissionDate.toDate() : new Date(submission.submissionDate);
          if (submissionDate >= last7Days) analytics.submissionsLast7Days++;
          if (submissionDate >= last30Days) analytics.submissionsLast30Days++;
        });

        // Calculate average submission time
        const totalTime = submissions.reduce((sum: number, sub: FormSubmission) => sum + (sub.submissionTime || 0), 0);
        analytics.averageSubmissionTime = submissions.length > 0 ? totalTime / submissions.length : 0;
        
        // Calculate conversion rate (completed / total)
        analytics.conversionRate = submissions.length > 0 ? (analytics.submissionsByStatus.completed / submissions.length) * 100 : 0;

        callback(analytics);
      }, (error: Error) => {
        console.error('Error in analytics snapshot:', error);
        callback(null);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to analytics:', error);
      callback(null);
      return () => {};
    }
  }

  // Get analytics data (one-time fetch)
  async getAnalytics(): Promise<SubmissionAnalytics> {
    try {
      const submissions = await this.getSubmissions();
      
      const analytics: SubmissionAnalytics = {
        totalSubmissions: submissions.length,
        submissionsByType: { website: 0, app: 0, general: 0 },
        submissionsByStatus: { new: 0, contacted: 0, in_progress: 0, completed: 0, cancelled: 0 },
        submissionsByCategory: {},
        submissionsByPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
        submissionsLast7Days: 0,
        submissionsLast30Days: 0,
        averageSubmissionTime: 0,
        conversionRate: 0
      };

      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      submissions.forEach((submission: FormSubmission) => {
          // Count by type
          analytics.submissionsByType[submission.formType]++;
          
          // Count by status
          analytics.submissionsByStatus[submission.status]++;
          
          // Count by category
          const categoryKey = submission.categoryNameAr || submission.categoryName;
          analytics.submissionsByCategory[categoryKey] = (analytics.submissionsByCategory[categoryKey] || 0) + 1;
          
          // Count by priority
          analytics.submissionsByPriority[submission.priority]++;
          
          // Count recent submissions
          const submissionDate = submission.submissionDate?.toDate ? submission.submissionDate.toDate() : new Date(submission.submissionDate);
          if (submissionDate >= last7Days) analytics.submissionsLast7Days++;
          if (submissionDate >= last30Days) analytics.submissionsLast30Days++;
        });

        // Calculate average submission time
        const totalTime = submissions.reduce((sum: number, sub: FormSubmission) => sum + (sub.submissionTime || 0), 0);
        analytics.averageSubmissionTime = submissions.length > 0 ? totalTime / submissions.length : 0;
      
      // Calculate conversion rate (completed / total)
      analytics.conversionRate = submissions.length > 0 ? (analytics.submissionsByStatus.completed / submissions.length) * 100 : 0;

      return analytics;
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      throw new Error('Failed to get analytics.');
    }
  }

  // Calculate priority based on form data
  private calculatePriority(submission: Omit<FormSubmission, 'id' | 'submissionDate' | 'status' | 'priority' | 'contactAttempts' | 'notes' | 'submissionTime' | 'formVersion'>): FormSubmission['priority'] {
    let score = 0;

    // Site type scoring
    if (submission.siteType === 'متجر إلكتروني') score += 3;
    if (submission.siteType === 'موقع مقدّم خدمات') score += 2;
    if (submission.siteType === 'تعديل على موقع قائم بالفعل') score += 1;

    // App type scoring
    if (submission.appType === 'تطبيق متجر') score += 3;
    if (submission.appType === 'تطبيق خدمات') score += 2;

    // Document type scoring
    if (submission.documentType === 'سجل تجاري') score += 2;
    if (submission.documentType === 'وثيقة عمل حر') score += 1;

    // Extra info scoring (shows engagement)
    if (submission.extraInfo && submission.extraInfo.length > 50) score += 1;

    // Request details scoring for general forms
    if (submission.requestDetails && submission.requestDetails.length > 100) score += 2;

    if (score >= 6) return 'urgent';
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  // Get client information
  private getClientInfo(): Pick<FormSubmission, 'clientIP' | 'userAgent' | 'utmSource' | 'utmMedium' | 'utmCampaign'> {
    const info: Pick<FormSubmission, 'clientIP' | 'userAgent' | 'utmSource' | 'utmMedium' | 'utmCampaign'> = {
      userAgent: navigator.userAgent,
      clientIP: '', // Will be filled by Cloud Functions or server
    };

    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    info.utmSource = urlParams.get('utm_source') || '';
    info.utmMedium = urlParams.get('utm_medium') || '';
    info.utmCampaign = urlParams.get('utm_campaign') || '';

    return info;
  }

  // Update analytics when submissions change
  private async updateAnalytics(action: 'add' | 'remove' | 'update', formType?: string, categoryId?: number): Promise<void> {
    try {
      // This would typically be handled by Cloud Functions
      // For now, we'll just log it
      console.log(`Analytics update: ${action} for ${formType} in category ${categoryId}`);
    } catch (error: any) {
      console.error('Error updating analytics:', error);
    }
  }
}

export const formSubmissionService = new FormSubmissionService();