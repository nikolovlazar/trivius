import { useState } from 'react';
import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/domains/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/domains/shared/components/ui/dialog';
import { SessionShareModal } from '@/domains/session/ui/session-share-modal';
import type {
  Session,
  SessionInsert,
} from '@/domains/session/entities/session';
import { createSession } from '@/domains/session/functions/create-session.function';

interface SessionManagerProps {
  gameId: number;
  gameName: string;
  sessions: Session[];
  isOpen: boolean;
  onClose: () => void;
  onNewSession: (newSession: SessionInsert) => void;
  onStopSession: (session: Session) => void;
}

export function SessionManager({
  gameId,
  gameName,
  sessions,
  isOpen,
  onClose,
  onNewSession,
  onStopSession,
}: SessionManagerProps) {
  const router = useRouter();
  const { user } = useRouteContext({ from: '/app' });
  const [shareSession, setShareSession] = useState<Session | null>(null);

  const startNewSession = async () => {
    const newSession: SessionInsert = {
      start_time: new Date().toISOString(),
      game_id: gameId,
      open: true,
    };

    const session = await createSession({
      data: {
        ...newSession,
        user_id: user!.id,
      },
    });

    if (session) {
      toast.success('Session created!');
      await router.invalidate();
    }
    onNewSession(newSession);
  };

  const endSession = (sessionId: number) => {
    const session = sessions.find((session) => session.id === sessionId);
    if (!session) return;

    onStopSession(session);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='w-full sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Manage Sessions for {gameName}</DialogTitle>
            <DialogDescription>
              Start a new session or manage existing ones.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <Button onClick={startNewSession} className='w-full mb-4'>
              Start New Session
            </Button>
            <div className='space-y-2 max-h-[300px] overflow-y-auto'>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className='flex items-center gap-2 justify-between p-2 dark:bg-gray-900 bg-gray-100 rounded'
                >
                  <div className='flex-1'>
                    <p className='font-medium'>Session {session.id}</p>
                    <p className='text-sm text-gray-500'>
                      {new Date(session.start_time).toLocaleString()}
                    </p>
                  </div>
                  {session.open && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setShareSession(session)}
                    >
                      <Share2 className='h-4 w-4' />
                    </Button>
                  )}
                  <Button
                    variant={session.open ? 'destructive' : 'secondary'}
                    size='sm'
                    onClick={() => endSession(session.id)}
                    disabled={session.open && !!session.end_time}
                  >
                    {session.open ? 'End Session' : 'Completed'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {shareSession && (
        <SessionShareModal
          isOpen={!!shareSession}
          onClose={() => setShareSession(null)}
          sessionId={shareSession.id}
          gameTitle={gameName}
        />
      )}
    </>
  );
}
