import { useRouteContext } from '@tanstack/react-router';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import { updateQuestion } from '@/domains/question/functions/update-question.function';
import { Question } from '@/domains/question/types/question';
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

export function UpdateQuestionModal({
  isOpen,
  onClose,
  question,
}: {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}) {
  const { user } = useRouteContext({ from: '/app' });
  const [error, setError] = useState('');

  const updateQuestionMutation = useMutation({
    fn: updateQuestion,
    onSuccess: () => {
      toast.success('Question updated!');
      onClose();
    },
    onFailure: ({ error }) => {
      setError(error.message);
      toast.error('Failed to update question');
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (!user) return;

    updateQuestionMutation.mutate({
      data: {
        id: question.id,
        content: e.currentTarget.elements['content'].value,
        game_id: question.game_id,
        right_answer_index: parseInt(
          e.currentTarget.elements['correct_answer'].value
        ),
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
          <DialogTitle>Update question</DialogTitle>
          <DialogDescription>
            Content supports markdown, so you can also use images, code blocks,
            and embedded videos as the question itself.
          </DialogDescription>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Textarea
            placeholder='Question'
            name='content'
            required
            defaultValue={question.content}
          />
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                name='correct_answer'
                value='1'
                required
                defaultChecked={question.right_answer_index === 1}
              />
              <Textarea
                placeholder='Answer 1'
                name='answer_1_content'
                required
                className='flex-1'
                defaultValue={question.answer_1_content}
              />
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                name='correct_answer'
                value='2'
                required
                defaultChecked={question.right_answer_index === 2}
              />
              <Textarea
                placeholder='Answer 2'
                name='answer_2_content'
                required
                className='flex-1'
                defaultValue={question.answer_2_content}
              />
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                name='correct_answer'
                value='3'
                required
                defaultChecked={question.right_answer_index === 3}
              />
              <Textarea
                placeholder='Answer 3'
                name='answer_3_content'
                required
                className='flex-1'
                defaultValue={question.answer_3_content}
              />
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='radio'
                name='correct_answer'
                value='4'
                required
                defaultChecked={question.right_answer_index === 4}
              />
              <Textarea
                placeholder='Answer 4'
                name='answer_4_content'
                required
                className='flex-1'
                defaultValue={question.answer_4_content}
              />
            </div>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          <div className='flex justify-end'>
            <FormSubmitButton>Update</FormSubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
