import { motion } from 'framer-motion';
import { FolderKanban, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityList } from '@/components/dashboard/ActivityList';
import { mockProjects, mockJobs, mockMessages, mockActivities } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const unreadMessages = mockMessages.filter(m => m.status === 'unread').length;
  const activeProjects = mockProjects.filter(p => p.status === 'active' || p.status === 'in-progress').length;
  const openJobs = mockJobs.filter(j => j.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-primary p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/80 max-w-xl">
            Here's what's happening with your projects today. Stay on top of your tasks and manage your team efficiently.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12% this week</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Projects"
          value={mockProjects.length}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
          color="primary"
          delay={0.1}
        />
        <StatCard
          title="Open Jobs"
          value={openJobs}
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
          color="accent"
          delay={0.2}
        />
        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          icon={MessageSquare}
          trend={{ value: 5, isPositive: false }}
          color="warning"
          delay={0.3}
        />
      </div>

      {/* Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityList activities={mockActivities} />
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Overview</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">{activeProjects}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">127</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">94%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
