import { Button } from '@/domains/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/shared/components/ui/dialog';

interface ConfirmDeletionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  itemName?: string;
}

export function ConfirmDeletion({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
}: ConfirmDeletionProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            {`Are you sure you want to delete ${
              itemName ? `"${itemName}"` : 'this item'
            }? This action cannot be undone.`}
          </p>
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
