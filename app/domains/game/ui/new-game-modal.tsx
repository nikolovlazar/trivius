import { toast } from 'sonner';
import { useState } from 'react';
import { useRouteContext, useRouter } from '@tanstack/react-router';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import { createGame } from '@/domains/game/functions/create-game.function';

export function NewGameModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user } = useRouteContext({ from: '/app' });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title) {
      setError('Title is required');
      return;
    }
    try {
      const newGame = await createGame({
        data: { title, description, userId: user!.id },
      });
      if (newGame) {
        router.invalidate();
        toast.success('Game created!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to create game');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create a new game</DialogTitle>
          <DialogDescription>
            Create a new game to start playing trivia.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='flex justify-end'>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
