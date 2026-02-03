// src/components/jobs/JobForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Job } from '@/types/job';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experience: z.enum(['entry', 'mid', 'senior', 'lead']),
  salary: z.string().min(1, 'Salary is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['open', 'closed', 'draft']),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: Job | null;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
}

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      type: job?.type || 'full-time',
      experience: job?.experience || 'mid',
      salary: job?.salary || '',
      location: job?.location || '',
      description: job?.description || '',
      deadline: job?.deadline ? formatDateForInput(job.deadline) : '',
      status: job?.status || 'open',
    },
  });

  // Helper to format date for input field
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleFormSubmit = (data: JobFormData) => {
    onSubmit(data);
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            {...register('title')}
            className="bg-secondary/50"
            placeholder="e.g. Senior Developer"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Job Type *</Label>
          <Select
            value={watch('type')}
            onValueChange={(value: Job['type']) => setValue('type', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level *</Label>
          <Select
            value={watch('experience')}
            onValueChange={(value: Job['experience']) => setValue('experience', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead/Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary *</Label>
          <Input
            id="salary"
            {...register('salary')}
            className="bg-secondary/50"
            placeholder="e.g. $100,000 - $130,000"
            disabled={isSubmitting}
          />
          {errors.salary && (
            <p className="text-sm text-destructive">{errors.salary.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register('location')}
            className="bg-secondary/50"
            placeholder="e.g. Remote, New York, NY"
            disabled={isSubmitting}
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline *</Label>
          <Input
            id="deadline"
            type="date"
            {...register('deadline')}
            className="bg-secondary/50"
            disabled={isSubmitting}
            min={minDate}
          />
          {errors.deadline && (
            <p className="text-sm text-destructive">{errors.deadline.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="bg-secondary/50 min-h-[120px]"
          placeholder="Describe the role, responsibilities, and requirements..."
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={watch('status')}
          onValueChange={(value: Job['status']) => setValue('status', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="gradient-primary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {job ? 'Saving...' : 'Creating...'}
            </span>
          ) : (
            job ? 'Save Changes' : 'Create Job'
          )}
        </Button>
      </div>
    </form>
  );
}