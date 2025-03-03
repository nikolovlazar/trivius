import { useRouter } from '@tanstack/react-router';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Pencil, Share, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Game } from '@/domains/game/types/game';
import { deleteSession } from '@/domains/session/functions/delete-session.function';
import { updateSession } from '@/domains/session/functions/update-session.function';
import { Session } from '@/domains/session/types/session';
import { NewSessionModal } from '@/domains/session/ui/new-session-modal';
import { SessionOpenSwitch } from '@/domains/session/ui/session-open-switch';
import { SessionShareModal } from '@/domains/session/ui/session-share-modal';
import { UpdateSessionModal } from '@/domains/session/ui/update-session-modal';
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
  sessions: Session[];
  game: Game;
  userId?: string;
};

export function SessionsTable({ sessions, game, userId }: Props) {
  const router = useRouter();

  const [deletingSession, setDeletingSession] = useState<Session | undefined>();
  const [updatingSession, setUpdatingSession] = useState<Session | undefined>();
  const [sharingSession, setSharingSession] = useState<Session | undefined>();
  const [startNewSessionModalOpened, setStartNewSessionModalOpened] =
    useState(false);

  const deleteSessionMutation = useMutation({
    fn: deleteSession,
    onSuccess: () => {
      toast.success('Session deleted!');
      router.invalidate();
    },
  });

  const updateSessionMutation = useMutation({
    fn: updateSession,
    onSuccess: () => {
      toast.success('Session updated!');
      router.invalidate();
    },
  });

  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    if (!userId) return;

    await deleteSessionMutation.mutate({
      data: { session_id: deletingSession.id },
    });
  };

  const handleSessionOpenChange = async (
    sessionId: number,
    newValue: boolean
  ) => {
    await updateSessionMutation.mutate({
      data: { id: sessionId, open: newValue },
    });
  };

  const columns: ColumnDef<Session>[] = useMemo(
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
        accessorKey: 'open',
        header: 'Open',
        meta: {
          className: 'w-[54px]',
        },
        cell: ({ row }) => (
          <SessionOpenSwitch
            sessionId={row.original.id}
            open={row.original.open}
            onToggle={handleSessionOpenChange}
          />
        ),
      },
      {
        accessorKey: 'label',
        header: 'Label',
        meta: {
          className: 'flex-1',
        },
      },
      {
        accessorKey: 'start_time',
        header: 'Start',
        cell: ({ row }) =>
          row.original.start_time
            ? format(row.original.start_time, 'PP, p')
            : 'Not set',
      },
      {
        accessorKey: 'end_time',
        header: 'End',
        cell: ({ row }) =>
          row.original.end_time
            ? format(row.original.end_time, 'PP, p')
            : 'Not set',
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
                    onClick={() => setSharingSession(row.original)}
                  >
                    <Share />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share session</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setUpdatingSession(row.original)}
                  >
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Update session</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-destructive'
                    size='icon'
                    onClick={() => setDeletingSession(row.original)}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete session</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: sessions,
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
        <legend className='text-lg font-semibold px-2 -mb-4'>Sessions</legend>
        <div className='flex justify-between'>
          <Input className='max-w-[300px]' placeholder='Search sessions...' />
          <Button onClick={() => setStartNewSessionModalOpened(true)}>
            Start new session
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
                    No sessions for this game have been created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </fieldset>

      {deletingSession && (
        <ConfirmDeletion
          title={`Are you sure you want to delete this session?`}
          isOpen={!!deletingSession}
          onClose={() => setDeletingSession(undefined)}
          onConfirm={handleDeleteSession}
          itemName={deletingSession.label}
        />
      )}

      {updatingSession && (
        <UpdateSessionModal
          isOpen={!!updatingSession}
          onClose={() => setUpdatingSession(undefined)}
          session={updatingSession}
        />
      )}

      {startNewSessionModalOpened && (
        <NewSessionModal
          isOpen={startNewSessionModalOpened}
          onClose={() => setStartNewSessionModalOpened(false)}
          gameId={game.id}
          userId={userId}
        />
      )}

      {sharingSession && (
        <SessionShareModal
          isOpen={!!sharingSession}
          onClose={() => setSharingSession(undefined)}
          sessionId={sharingSession.id}
          gameTitle={game.title}
        />
      )}
    </>
  );
}
