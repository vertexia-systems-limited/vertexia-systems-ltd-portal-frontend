export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  status: 'active' | 'completed' | 'in-progress' | 'archived';
  image: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'project' | 'job' | 'message';
  action: string;
  description: string;
  timestamp: string;
}
