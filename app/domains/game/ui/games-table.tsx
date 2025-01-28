import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

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
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/domains/shared/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';

type Props = {
  games: { game: Game; sessions: Session[] }[];
  onManageSessions: (id: number) => void;
};

export function GamesTable({ games, onManageSessions }: Props) {
  const columns: ColumnDef<{ game: Game; sessions: Session[] }>[] = useMemo(
    () => [
      {
        accessorKey: 'game.id',
        header: 'ID',
      },
      {
        accessorKey: 'game.title',
        header: 'Title',
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
      },
      {
        id: 'actions',
        size: 40,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{row.original.game.title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => onManageSessions(row.original.game.id)}
              >
                Manage sessions
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>
                Delete game
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
