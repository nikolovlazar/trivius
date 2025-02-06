import { useRouteContext, useRouter } from '@tanstack/react-router';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { createGame } from '@/domains/game/functions/create-game.function';
import { GameInsert } from '@/domains/game/types/game';

import { FormSubmitButton } from '@/domains/shared/components/form-submit-button';
import { Button } from '@/domains/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/domains/shared/components/ui/dialog';
import { Input } from '@/domains/shared/components/ui/input';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

export function NewGameModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user } = useRouteContext({ from: '/app' });
  const [error, setError] = useState('');

  const newGameMutation = useMutation({
    fn: createGame,
    onSuccess: () => {
      router.invalidate();
      toast.success('Game created!');
      onClose();
    },
    onFailure: ({ error }) => {
      setError(error.message);
      toast.error('Failed to create game');
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (!user) return;

    const newGame: GameInsert = {
      title: e.currentTarget.elements['title'].value,
      description: e.currentTarget.elements['description'].value,
    };

    newGameMutation.mutate({ data: { ...newGame, userId: user.id } });
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
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input placeholder='Title' name='title' required />
          <Input placeholder='Description' name='description' />
          {error && <p className='text-red-500'>{error}</p>}
          <div className='flex justify-end'>
            <FormSubmitButton>Create</FormSubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
