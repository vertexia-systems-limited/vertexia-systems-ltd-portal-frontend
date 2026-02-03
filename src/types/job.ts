export interface Job {
  _id: string;
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  salary: string;
  location: string;
  deadline: string;
  description: string;
  status: 'open' | 'closed' | 'draft';
  applicationsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  salary: string;
  location: string;
  deadline: string;
  description: string;
  status: 'open' | 'closed' | 'draft';
}