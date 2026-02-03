import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Briefcase, 
  MessageSquare, 
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/contacts' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function MobileSidebar() {
  const location = useLocation();

  return (
    <div className="h-full bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">TechStartup</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <SheetClose asChild key={item.path}>
              <Link to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </div>
  );
}
