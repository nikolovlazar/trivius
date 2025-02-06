import { useRouter } from '@tanstack/react-router';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Game } from '@/domains/game/types/game';
import { Question } from '@/domains/qna/types/question';
import { NewQuestionModal } from '@/domains/qna/ui/new-question-modal';
import { ConfirmDeletion } from '@/domains/shared/components/confirm-deletion';
import { Button } from '@/domains/shared/components/ui/button';
import { Input } from '@/domains/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/shared/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/domains/shared/components/ui/tooltip';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

type Props = {
  questions: Question[];
  game: Game;
  userId?: string;
};

export function QuestionsTable({ questions, game, userId }: Props) {
  const router = useRouter();

  const [deletingQuestion, setDeletingQuestion] = useState<
    Question | undefined
  >();
  const [updatingQuestion, setUpdatingQuestion] = useState<
    Question | undefined
  >();
  const [addQuestionModalOpened, setAddQuestionModalOpened] = useState(false);

  const deleteQuestionMutation = useMutation({
    fn: () => Promise.resolve(),
    onSuccess: () => {
      toast.success('Question deleted!');
      router.invalidate();
    },
  });

  const updateQuestionMutation = useMutation({
    fn: () => Promise.resolve(),
    onSuccess: () => {
      toast.success('Question updated!');
      router.invalidate();
    },
  });

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;
    if (!userId) return;

    await deleteQuestionMutation.mutate({
      data: { id: deletingQuestion.id },
    });
  };

  const handleQuestionUpdate = async (
    questionId: number,
    newValue: boolean
  ) => {
    await updateQuestionMutation.mutate({
      data: { id: questionId, open: newValue },
    });
  };

  const columns: ColumnDef<Question>[] = useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        meta: {
          className: 'w-[46px]',
        },
        sortingFn: 'auto',
      },
      {
        accessorKey: 'content',
        header: 'Question',
        meta: {
          className: 'flex-1',
        },
      },
      {
        id: 'actions',
        header: '',
        meta: {
          className: 'w-[120px]',
        },
        cell: ({ row }) => (
          <div className='flex gap-1'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setUpdatingQuestion(row.original)}
                  >
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Update question</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-destructive'
                    size='icon'
                    onClick={() => setDeletingQuestion(row.original)}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete question</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'id', desc: false }],
    },
  });

  return (
    <>
      <fieldset className='border rounded-lg pt-6 px-6 space-y-4'>
        <legend className='text-lg font-semibold px-2 -mb-4'>Questions</legend>
        <div className='flex justify-between'>
          <Input className='max-w-[300px]' placeholder='Search questions...' />
          <Button onClick={() => setAddQuestionModalOpened(true)}>
            Add question
          </Button>
        </div>
        <div className='-mx-6'>
          <Table className='table-fixed w-full'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        // @ts-ignore
                        className={header.column.columnDef.meta?.className}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No questions for this game have been created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </fieldset>

      {deletingQuestion && (
        <ConfirmDeletion
          title={`Are you sure you want to delete this question?`}
          isOpen={!!deletingQuestion}
          onClose={() => setDeletingQuestion(undefined)}
          onConfirm={handleDeleteQuestion}
          itemName={deletingQuestion.content}
        />
      )}

      {/* {updatingQuestion && (
        <UpdateQuestionModal
          isOpen={!!updatingQuestion}
          onClose={() => setUpdatingQuestion(undefined)}
          question={updatingQuestion}
        />
      )} */}

      {addQuestionModalOpened && (
        <NewQuestionModal
          isOpen={addQuestionModalOpened}
          onClose={() => setAddQuestionModalOpened(false)}
          gameId={game.id}
        />
      )}
    </>
  );
}
