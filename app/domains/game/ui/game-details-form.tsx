import { useRouter } from '@tanstack/react-router';
import { FormEventHandler, useCallback, useState } from 'react';
import { toast } from 'sonner';

import { deleteGame } from '@/domains/game/functions/delete-game.function';
import { updateGame } from '@/domains/game/functions/update-game.function';
import { type Game } from '@/domains/game/types/game';
import { ConfirmDeletion } from '@/domains/shared/components/confirm-deletion';
import { Button } from '@/domains/shared/components/ui/button';
import { Input } from '@/domains/shared/components/ui/input';
import { Textarea } from '@/domains/shared/components/ui/textarea';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

type Props = {
  game: Game;
};

export function GameDetailsForm({ game }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const deleteGameMutation = useMutation({
    fn: deleteGame,
    onSuccess: () => {
      toast.success('Game deleted!');
      router.navigate({ to: '/app', replace: true });
    },
  });

  const updateGameMutation = useMutation({
    fn: updateGame,
    onSuccess: () => {
      toast.success('Game updated!');
    },
  });

  const handleGameDelete = useCallback(() => {
    deleteGameMutation.mutate({ data: game.id });
  }, []);

  const toggleDeletingModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDeleting(!deleting);
    },
    [deleting]
  );

  const handleGameUpdate: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      updateGameMutation.mutate({
        data: {
          id: game.id,
          title: e.currentTarget.elements['title'].value,
          description: e.currentTarget.elements['description'].value,
          answer_window: parseInt(
            e.currentTarget.elements['answer_window'].value
          ),
        },
      });
    },
    []
  );

  return (
    <>
      <form onSubmit={handleGameUpdate}>
        <fieldset className='border rounded-lg p-6 space-y-4'>
          <legend className='text-lg font-semibold px-2 -mb-4'>
            Game Details
          </legend>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <label htmlFor='title' className='text-sm font-medium'>
                Title
              </label>
              <Input
                id='title'
                name='title'
                required
                defaultValue={game.title}
                placeholder='Game Title'
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='description' className='text-sm font-medium'>
                Description
              </label>
              <Textarea
                id='description'
                name='description'
                defaultValue={game.description ?? undefined}
                placeholder='Game Description'
                rows={4}
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='answer_window' className='text-sm font-medium'>
                Answer Window (seconds)
              </label>
              <Input
                id='answer_window'
                name='answer_window'
                type='number'
                defaultValue={`${game.answer_window}`}
                placeholder='Answer Window (seconds)'
              />
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='destructive' onClick={toggleDeletingModal}>
              Delete
            </Button>
            <Button type='submit'>Update</Button>
          </div>
        </fieldset>
      </form>

      {deleting && (
        <ConfirmDeletion
          title={`Are you sure you want to delete this game?`}
          isOpen={deleting}
          onClose={() => setDeleting(false)}
          onConfirm={handleGameDelete}
          itemName={game.title}
        />
      )}
    </>
  );
}
