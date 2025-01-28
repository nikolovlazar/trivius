import { Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/components/ui/button';

interface GameRowProps {
  id: number;
  title: string;
  sessionCount: number;
  onManageSessions: (id: number) => void;
}

export function GameRow({
  id,
  title,
  sessionCount,
  onManageSessions,
}: GameRowProps) {
  return (
    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
      <Link
        to={`/app/games/$gameId`}
        params={{ gameId: `${id}` }}
        className='flex-grow hover:underline'
      >
        <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
        <p className='text-sm text-gray-600'>
          {sessionCount} session{sessionCount !== 1 ? 's' : ''}
        </p>
      </Link>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onManageSessions(id)}
        >
          <Play className='h-4 w-4 mr-2' />
          Manage Sessions
        </Button>
      </div>
    </div>
  );
}
