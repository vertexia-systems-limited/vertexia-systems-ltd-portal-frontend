import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary/20 to-primary/5 border-primary/20',
  accent: 'from-accent/20 to-accent/5 border-accent/20',
  success: 'from-success/20 to-success/5 border-success/20',
  warning: 'from-warning/20 to-warning/5 border-warning/20',
};

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6',
        'bg-gradient-to-br backdrop-blur-xl',
        'hover:shadow-lg transition-shadow duration-300',
        colorClasses[color]
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-current to-transparent opacity-5" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
            className="text-3xl font-bold text-foreground"
          >
            {value}
          </motion.p>
          
          {trend && (
            <p className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        
        <div className={cn('p-3 rounded-xl', iconColorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
