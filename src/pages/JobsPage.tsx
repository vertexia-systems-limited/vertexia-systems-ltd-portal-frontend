import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Filter, MapPin, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { Job } from '@/types/job';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { JobForm } from '@/components/jobs/JobForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { jobApi } from '@/services/job-api';

const statusColors: Record<Job['status'], string> = {
  open: 'bg-success/10 text-success border-success/20',
  closed: 'bg-destructive/10 text-destructive border-destructive/20',
  draft: 'bg-muted text-muted-foreground border-muted',
};

const typeColors: Record<Job['type'], string> = {
  'full-time': 'bg-primary/10 text-primary',
  'part-time': 'bg-accent/10 text-accent',
  'contract': 'bg-warning/10 text-warning',
  'internship': 'bg-success/10 text-success',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery;
      }
      
      const response = await jobApi.getJobs(params);
      setJobs(response.jobs);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        pages: response.pages,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        fetchJobs();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const handleAddJob = async (data: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | 'applicationsCount' | 'isActive'>) => {
    try {
      const newJob = await jobApi.createJob(data);
      setJobs([newJob, ...jobs]);
      setIsFormOpen(false);
      toast.success('Job created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create job');
    }
  };

  const handleEditJob = async (data: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | 'applicationsCount' | 'isActive'>) => {
    if (!editingJob) return;
    
    try {
      const updatedJob = await jobApi.updateJob(editingJob._id, data);
      setJobs(jobs.map(j => 
        j._id === editingJob._id ? updatedJob : j
      ));
      setEditingJob(null);
      toast.success('Job updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async () => {
    if (!deletingJob) return;
    
    try {
      await jobApi.deleteJob(deletingJob._id);
      setJobs(jobs.filter(j => j._id !== deletingJob._id));
      setDeletingJob(null);
      toast.success('Job deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job');
    }
  };

  const handleStatusToggle = async (job: Job) => {
    try {
      const newStatus = job.status === 'open' ? 'closed' : 'open';
      const updatedJob = await jobApi.updateJob(job._id, { status: newStatus });
      setJobs(jobs.map(j => 
        j._id === job._id ? updatedJob : j
      ));
      toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'} successfully!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update job status');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    
    return jobs.filter((job) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.salary.toLowerCase().includes(searchLower)
      );
    });
  }, [jobs, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${pagination.total} total jobs`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="gradient-primary text-white shadow-glow"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50"
            disabled={loading}
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading jobs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-12">
                        <p className="text-muted-foreground">
                          {searchQuery ? 'No jobs found matching your search' : 'No jobs available'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <motion.tr
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-secondary/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{job.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden">
                              <Badge className={cn('text-xs', typeColors[job.type])}>
                                {job.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {job.salary}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {job.applicationsCount} applicants
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={cn('capitalize', typeColors[job.type])}>
                            {job.type.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(job.deadline)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              'capitalize border cursor-pointer hover:opacity-80 transition-opacity',
                              statusColors[job.status]
                            )}
                            onClick={() => handleStatusToggle(job)}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingJob(job)}
                              disabled={loading}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingJob(job)}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} • {pagination.total} total jobs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                fetchJobs();
              }}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                fetchJobs();
              }}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen || !!editingJob} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditingJob(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit Job Posting' : 'Add New Job'}
            </DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update job details' : 'Create a new job posting'}
            </DialogDescription>
          </DialogHeader>
          <JobForm
            job={editingJob}
            onSubmit={editingJob ? handleEditJob : handleAddJob}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingJob(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingJob} onOpenChange={() => setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingJob?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteJob}
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