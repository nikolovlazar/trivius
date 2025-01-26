import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <Button variant='ghost' size='icon' aria-label='Logout'>
      <LogOut className='h-5 w-5' />
    </Button>
  );
}
