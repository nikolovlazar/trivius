import { useRouteContext, useRouter } from '@tanstack/react-router';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { createQuestion } from '@/domains/qna/functions/create-question.function';
import { FormSubmitButton } from '@/domains/shared/components/form-submit-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/domains/shared/components/ui/dialog';
import { Textarea } from '@/domains/shared/components/ui/textarea';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

export function NewQuestionModal({
  isOpen,
  onClose,
  gameId,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameId: number;
}) {
  const router = useRouter();
  const { user } = useRouteContext({ from: '/app' });
  const [error, setError] = useState('');

  const newQuestionMutation = useMutation({
    fn: createQuestion,
    onSuccess: () => {
      router.invalidate();
      toast.success('Question created!');
      onClose();
    },
    onFailure: ({ error }) => {
      setError(error.message);
      toast.error('Failed to create question');
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (!user) return;

    const rightAnswerIndex = parseInt(
      e.currentTarget.elements['correct_answer'].value
    );

    newQuestionMutation.mutate({
      data: {
        content: e.currentTarget.elements['content'].value,
        game_id: gameId,
        right_answer_index: rightAnswerIndex,
        answer_1_content: e.currentTarget.elements['answer_1_content'].value,
        answer_2_content: e.currentTarget.elements['answer_2_content'].value,
        answer_3_content: e.currentTarget.elements['answer_3_content'].value,
        answer_4_content: e.currentTarget.elements['answer_4_content'].value,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Create a new question</DialogTitle>
          <DialogDescription>
            Content supports markdown, so you can also use images, code blocks,
            and embedded videos as the question itself.
          </DialogDescription>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Textarea placeholder='Question' name='content' required />
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                name='correct_answer'
                value='1'
                required
                defaultChecked
              />
              <Textarea
                placeholder='Answer 1'
                name='answer_1_content'
                required
                className='flex-1'
              />
            </div>
            <div className='flex items-center gap-4'>
              <input type='radio' name='correct_answer' value='2' required />
              <Textarea
                placeholder='Answer 2'
                name='answer_2_content'
                required
                className='flex-1'
              />
            </div>
            <div className='flex items-center gap-4'>
              <input type='radio' name='correct_answer' value='3' required />
              <Textarea
                placeholder='Answer 3'
                name='answer_3_content'
                required
                className='flex-1'
              />
            </div>
            <div className='flex items-center gap-4'>
              <input type='radio' name='correct_answer' value='4' required />
              <Textarea
                placeholder='Answer 4'
                name='answer_4_content'
                required
                className='flex-1'
              />
            </div>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          <div className='flex justify-end'>
            <FormSubmitButton>Create</FormSubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
