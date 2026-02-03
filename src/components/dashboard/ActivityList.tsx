import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { FolderKanban, Briefcase, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityListProps {
  activities: Activity[];
}

const activityIcons = {
  project: FolderKanban,
  job: Briefcase,
  message: MessageSquare,
};

const activityColors = {
  project: 'bg-primary/10 text-primary',
  job: 'bg-accent/10 text-accent',
  message: 'bg-success/10 text-success',
};

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-muted-foreground" />
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className={cn('p-2 rounded-lg flex-shrink-0', activityColors[activity.type])}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
