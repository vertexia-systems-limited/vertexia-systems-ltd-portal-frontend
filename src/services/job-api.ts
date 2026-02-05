// src/services/job-api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API Timeout:', error.config?.url);
      return Promise.reject(new Error('Request timeout. Please check your connection.'));
    }
    
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
      
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // No response received
      console.error('API No Response:', error.request);
      return Promise.reject(new Error('Network error. Please check if the server is running.'));
    } else {
      // Request setup error
      console.error('API Setup Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export interface CreateJobDto {
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  salary: string;
  location: string;
  deadline: string;
  description: string;
  status: 'open' | 'closed' | 'draft';
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  applicationsCount?: number;
}

export interface JobResponse {
  _id: string;
  title: string;
  type: string;
  experience: string;
  salary: string;
  location: string;
  deadline: string;
  description: string;
  status: string;
  applicationsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobsListResponse {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byExperience: Record<string, number>;
}

export const jobApi = {
  // Create a new job
  createJob: async (data: CreateJobDto): Promise<JobResponse> => {
    const response = await api.post<JobResponse>('/jobs', data);
    return response.data;
  },

  // Get all jobs with optional filters
  getJobs: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    experience?: string;
    status?: string;
    location?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<JobsListResponse> => {
    try {
      const response = await api.get<JobsListResponse>('/jobs', { params });
      
      // Ensure response has the expected structure
      if (!response.data.jobs) {
        console.warn('API response missing jobs array:', response.data);
        return {
          jobs: [],
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          pages: 0,
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Return empty structure instead of throwing
      return {
        jobs: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        pages: 0,
      };
    }
  },

  // Get single job by ID
  getJob: async (id: string): Promise<JobResponse> => {
    const response = await api.get<JobResponse>(`/jobs/${id}`);
    return response.data;
  },

  // Update job by ID
  updateJob: async (id: string, data: UpdateJobDto): Promise<JobResponse> => {
    const response = await api.patch<JobResponse>(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job by ID (soft delete)
  deleteJob: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/jobs/${id}`);
    return response.data;
  },

  // Get job statistics
  getJobStats: async (): Promise<JobStats> => {
    try {
      const response = await api.get<JobStats>('/jobs/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        total: 0,
        byType: {},
        byStatus: {},
        byExperience: {},
      };
    }
  },

  // Increment applications count
  incrementApplications: async (id: string): Promise<JobResponse> => {
    const response = await api.post<JobResponse>(`/jobs/${id}/apply`);
    return response.data;
  },

  // Search jobs
  searchJobs: async (query: string): Promise<JobResponse[]> => {
    try {
      const response = await api.get<JobResponse[]>('/jobs/search', {
        params: { q: query }
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to search jobs:', error);
      return [];
    }
  },
};