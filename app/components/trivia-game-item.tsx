import { Trash2, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

interface TriviaGameItemProps {
  id: number;
  title: string;
  sessionCount: number;
  onDelete: (id: number) => void;
  onManageSessions: (id: number) => void;
}

export function TriviaGameItem({
  id,
  title,
  sessionCount,
  onDelete,
  onManageSessions,
}: TriviaGameItemProps) {
  return (
    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
      <Link to={`/app/games/${id}`} className='flex-grow hover:underline'>
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
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete(id)}
          aria-label='Delete trivia game'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
