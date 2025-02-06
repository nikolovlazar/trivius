import { useRouter } from '@tanstack/react-router';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { updateSession } from '@/domains/session/functions/update-session.function';
import type { Session } from '@/domains/session/types/session';
import { FormSubmitButton } from '@/domains/shared/components/form-submit-button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/shared/components/ui/dialog';
import { Input } from '@/domains/shared/components/ui/input';
import { Label } from '@/domains/shared/components/ui/label';
import { Switch } from '@/domains/shared/components/ui/switch';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
};

export function UpdateSessionModal({ session, isOpen, onClose }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(session.open);

  const updateSessionMutation = useMutation({
    fn: updateSession,
    onSuccess: () => {
      toast.success('Session updated!');
      onClose();
      router.invalidate();
    },
    onFailure: ({ error }) => {
      toast.error(
        'Failed to update session. Check your data, or try again later. Reason:' +
          error.message
      );
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await updateSessionMutation.mutate({
      data: {
        id: session.id,
        label: e.currentTarget.elements['label'].value,
        start_time: e.currentTarget.elements['start_time'].value,
        end_time: e.currentTarget.elements['end_time'].value,
        open,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='label'>
              Label <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='label'
              name='label'
              required
              defaultValue={session.label}
            />
          </div>
          <div className='flex space-x-4 w-full'>
            <div className='space-y-2 flex-1'>
              <Label>Start Date</Label>
              <Input
                id='start_time'
                name='start_time'
                type='datetime-local'
                required
                defaultValue={session.start_time ?? ''}
              />
            </div>
            <div className='space-y-2 flex-1'>
              <Label>End Date</Label>
              <Input
                id='end_time'
                name='end_time'
                type='datetime-local'
                defaultValue={session.end_time ?? undefined}
              />
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='isOpen'
              name='open'
              checked={open}
              onCheckedChange={setOpen}
            />
            <Label htmlFor='isOpen'>Open for Registration</Label>
          </div>
          <DialogFooter>
            <FormSubmitButton>Update Session</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
