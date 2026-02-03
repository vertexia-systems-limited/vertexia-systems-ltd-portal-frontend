import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Mail, Eye, EyeOff, Calendar } from 'lucide-react';
import { ContactMessage } from '@/types';
import { mockMessages } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      return (
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [messages, searchQuery]);

  const handleViewMessage = (message: ContactMessage) => {
    // Mark as read when viewing
    if (message.status === 'unread') {
      setMessages(messages.map(m =>
        m.id === message.id ? { ...m, status: 'read' as const } : m
      ));
    }
    setViewingMessage(message);
  };

  const handleToggleRead = (message: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = message.status === 'read' ? 'unread' : 'read';
    setMessages(messages.map(m =>
      m.id === message.id ? { ...m, status: newStatus } : m
    ));
    toast.success(`Message marked as ${newStatus}`);
  };

  const handleDeleteMessage = () => {
    if (!deletingMessage) return;
    
    setMessages(messages.filter(m => m.id !== deletingMessage.id));
    setDeletingMessage(null);
    toast.success('Message deleted successfully!');
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread messages` : 'All messages read'}
          </p>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.tr
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleViewMessage(message)}
                    className={cn(
                      'group cursor-pointer transition-colors',
                      message.status === 'unread' 
                        ? 'bg-primary/5 hover:bg-primary/10' 
                        : 'hover:bg-secondary/50'
                    )}
                  >
                    <TableCell>
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        message.status === 'unread' ? 'bg-primary' : 'bg-transparent'
                      )} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={cn(
                          'text-foreground',
                          message.status === 'unread' && 'font-semibold'
                        )}>
                          {message.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className={cn(
                        'line-clamp-1 max-w-xs',
                        message.status === 'unread' ? 'font-medium text-foreground' : 'text-muted-foreground'
                      )}>
                        {message.subject}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(message.createdAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          message.status === 'unread' 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'text-muted-foreground'
                        )}
                      >
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => handleToggleRead(message, e)}
                          title={message.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                        >
                          {message.status === 'read' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingMessage(message);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages found</p>
          </div>
        )}
      </motion.div>

      {/* View Message Dialog */}
      <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingMessage?.subject}</DialogTitle>
            <DialogDescription className="flex flex-col gap-1 pt-2">
              <span className="font-medium text-foreground">{viewingMessage?.name}</span>
              <span>{viewingMessage?.email}</span>
              {viewingMessage && (
                <span className="text-xs">
                  {format(new Date(viewingMessage.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-secondary/50 rounded-xl">
            <p className="text-foreground whitespace-pre-wrap">{viewingMessage?.message}</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setViewingMessage(null)}>
              Close
            </Button>
            <Button className="gradient-primary text-white" asChild>
              <a href={`mailto:${viewingMessage?.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Reply
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from "{deletingMessage?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMessage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
