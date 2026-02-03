// src/services/job-api.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.10.109:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
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
    const response = await api.get<JobsListResponse>('/jobs', { params });
    return response.data;
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
    const response = await api.get<JobStats>('/jobs/stats');
    return response.data;
  },

  // Increment applications count
  incrementApplications: async (id: string): Promise<JobResponse> => {
    const response = await api.post<JobResponse>(`/jobs/${id}/apply`);
    return response.data;
  },

  // Search jobs
  searchJobs: async (query: string): Promise<JobResponse[]> => {
    const response = await api.get<JobResponse[]>('/jobs/search', {
      params: { q: query }
    });
    return response.data;
  },
};

// Hook for using job API
export const useJobApi = () => {
  return jobApi;
};