import { useState } from 'react';
import { Check, Copy, Share } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number;
  gameTitle: string;
}

export function SessionShareModal({
  isOpen,
  onClose,
  sessionId,
  gameTitle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `https://trivius.app/join/${sessionId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Share Session</DialogTitle>
          <DialogDescription>
            Invite players to join "{gameTitle}" - Session {sessionId}
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 space-y-4'>
          <div className='flex items-center space-x-2'>
            <Input value={inviteLink} readOnly />
            <Button size='icon' onClick={copyToClipboard}>
              {copied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
          <Button
            className='w-full'
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Join Trivius Session - ${gameTitle}`,
                  text: `Join my Trivius game session!`,
                  url: inviteLink,
                });
              } else {
                copyToClipboard();
              }
            }}
          >
            <Share className='h-4 w-4 mr-2' />
            Share Invite Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
