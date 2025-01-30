import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';

import { Game } from '@/domains/game/entities/game';
import { Session } from '@/domains/session/entities/session';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/domains/shared/components/ui/table';
import { Button } from '@/domains/shared/components/ui/button';
import { ConfirmDeletion } from '@/domains/shared/components/confirm-deletion';
import { deleteGame } from '@/domains/game/functions/delete-game.function';
import { useMutation } from '@/domains/shared/hooks/use-mutation';

type Props = {
  games: { game: Game; sessions: Session[] }[];
};

export function GamesTable({ games }: Props) {
  const router = useRouter();
  const [deletingGame, setDeletingGame] = useState<Game | undefined>();

  const deleteGameMutation = useMutation({
    fn: deleteGame,
    onSuccess: () => {
      toast.success('Game deleted!');
      router.invalidate();
    },
  });

  const handleDeleteGame = async () => {
    if (!deletingGame) return;

    await deleteGameMutation.mutate({ data: deletingGame.id });
  };

  const columns: ColumnDef<{ game: Game; sessions: Session[] }>[] = useMemo(
    () => [
      {
        accessorKey: 'game.id',
        header: 'ID',
        meta: {
          className: 'w-[46px]',
        },
      },
      {
        accessorKey: 'game.title',
        header: 'Title',
        meta: {
          className: 'flex-1',
        },
        cell: ({ row }) => (
          <Link
            to='/app/games/$gameId'
            params={{ gameId: `${row.original.game.id}` }}
          >
            {row.original.game.title}
          </Link>
        ),
      },
      {
        accessorFn: ({ sessions }) => sessions.length ?? 0,
        header: 'Sessions',
        meta: {
          className: 'w-[88px]',
        },
      },
      {
        id: 'actions',
        header: '',
        meta: {
          className: 'w-[60px]',
        },
        cell: ({ row }) => (
          <Button
            variant='ghost'
            className='text-destructive'
            size='icon'
            onClick={() => setDeletingGame(row.original.game)}
          >
            <Trash2 />
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: games,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className='rounded-md border'>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {deletingGame && (
        <ConfirmDeletion
          title={`Are you sure you want to delete this game?`}
          isOpen={!!deletingGame}
          onClose={() => setDeletingGame(undefined)}
          onConfirm={handleDeleteGame}
          itemName={deletingGame.title}
        />
      )}
    </>
  );
}
