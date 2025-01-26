import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Session, SessionInsert } from '@/types';
import { Share2 } from 'lucide-react';
import { SessionShareModal } from './session-share-modal';

interface SessionManagerProps {
  gameId: number;
  gameName: string;
  initialSessions: Session[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateSessions: (sessions: Session[]) => void;
}

export function SessionManager({
  gameId,
  gameName,
  initialSessions,
  isOpen,
  onClose,
  onUpdateSessions,
}: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [shareSession, setShareSession] = useState<Session | null>(null);

  const startNewSession = () => {
    const newSession: SessionInsert = {
      start_time: new Date().toISOString(),
      game_id: gameId,
      open: true,
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    onUpdateSessions(updatedSessions);
  };

  const endSession = (sessionId: number) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, open: false } : session
    );
    setSessions(updatedSessions as Session[]);
    onUpdateSessions(updatedSessions as Session[]);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
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
                  className='flex items-center justify-between p-2 bg-gray-100 rounded'
                >
                  <div>
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