// src/components/JobList.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { jobApi, JobsListResponse } from '@/services/job-api';
import { Job } from '@/types/job';
import { toast } from '@/hooks/use-toast';

interface JobListProps {
  onEdit?: (job: Job) => void;
  onView?: (job: Job) => void;
}

export function JobList({ onEdit, onView }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const response: JobsListResponse = await jobApi.getJobs({
        page,
        limit: pagination.limit,
        status: 'open',
      });
      
      setJobs(response.jobs);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        pages: response.pages,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await jobApi.deleteJob(id);
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
        variant: 'default',
      });
      fetchJobs(pagination.page); // Refresh current page
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: Job['status']) => {
    try {
      await jobApi.updateJob(id, { status: newStatus });
      toast({
        title: 'Success',
        description: `Job status changed to ${newStatus}`,
        variant: 'default',
      });
      fetchJobs(pagination.page);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update job status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No jobs found. Create your first job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                    <Badge 
                      variant={job.status === 'open' ? 'default' : 'secondary'}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{job.salary}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Applications: {job.applicationsCount}</span>
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView?.(job)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(job)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(
                    job._id, 
                    job.status === 'open' ? 'closed' : 'open'
                  )}
                >
                  {job.status === 'open' ? 'Close' : 'Reopen'}
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(job._id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchJobs(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchJobs(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}