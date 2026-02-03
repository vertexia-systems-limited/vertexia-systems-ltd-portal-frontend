import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Project } from '@/types';
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
import { Badge } from '@/components/ui/badge';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  githubUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  status: z.enum(['active', 'completed', 'in-progress', 'archived']),
  image: z.string().url('Must be a valid URL'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [techStack, setTechStack] = useState<string[]>(project?.techStack || []);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      githubUrl: project?.githubUrl || '',
      liveUrl: project?.liveUrl || '',
      status: project?.status || 'active',
      image: project?.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    },
  });

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit({
      title: data.title,
      description: data.description,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      status: data.status,
      image: data.image,
      techStack,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            className="bg-secondary/50"
            placeholder="Project name"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={watch('status')}
            onValueChange={(value: Project['status']) => setValue('status', value)}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          className="bg-secondary/50 min-h-[100px]"
          placeholder="Describe your project..."
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTech();
              }
            }}
            className="bg-secondary/50"
            placeholder="Add technology..."
          />
          <Button type="button" variant="secondary" onClick={addTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="pl-2 pr-1 py-1">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="ml-1 p-0.5 rounded-full hover:bg-destructive/20"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            {...register('githubUrl')}
            className="bg-secondary/50"
            placeholder="https://github.com/..."
          />
          {errors.githubUrl && (
            <p className="text-sm text-destructive">{errors.githubUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            {...register('liveUrl')}
            className="bg-secondary/50"
            placeholder="https://..."
          />
          {errors.liveUrl && (
            <p className="text-sm text-destructive">{errors.liveUrl.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          {...register('image')}
          className="bg-secondary/50"
          placeholder="https://..."
        />
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        )}
        {watch('image') && (
          <div className="mt-2 w-full h-40 rounded-lg overflow-hidden bg-secondary">
            <img 
              src={watch('image')} 
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250?text=Invalid+Image';
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="gradient-primary text-white"
          disabled={isSubmitting}
        >
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
