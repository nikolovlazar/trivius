import { useRouter } from '@tanstack/react-router';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { createSession } from '@/domains/session/functions/create-session.function';
import { SessionInsert } from '@/domains/session/types/session';
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
  gameId: number;
  userId?: string;
};

export function NewSessionModal({ userId, gameId, isOpen, onClose }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const newSessionMutation = useMutation({
    fn: createSession,
    onSuccess: () => {
      toast.success('Session created!');
      onClose();
      router.invalidate();
    },
    onFailure: ({ error }) => {
      toast.error(
        'Failed to create session. Check your data, or try again later. Reason:' +
          error.message
      );
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!userId) return;

    const start_time = e.currentTarget.elements['start_time'].value;
    const end_time = e.currentTarget.elements['end_time'].value;

    const data: SessionInsert = {
      open,
      label: e.currentTarget.elements['label'].value,
      start_time: start_time.length > 0 ? start_time : null,
      end_time: end_time.length > 0 ? end_time : null,
      game_id: gameId,
    };

    await newSessionMutation.mutate({
      data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='label'>
              Label <span className='text-red-500'>*</span>
            </Label>
            <Input id='label' name='label' required />
          </div>
          <div className='flex space-x-4 w-full'>
            <div className='space-y-2 flex-1'>
              <Label>Start Date</Label>
              <Input
                id='start_time'
                name='start_time'
                type='datetime-local'
                required
              />
            </div>
            <div className='space-y-2 flex-1'>
              <Label>End Date</Label>
              <Input id='end_time' name='end_time' type='datetime-local' />
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
            <FormSubmitButton>Save Session</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
