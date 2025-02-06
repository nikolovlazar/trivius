import { useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { Button } from '@/domains/shared/components/ui/button';
import { signoutFn } from '@/domains/user/functions/sign-out.function';

import { useMutation } from '../hooks/use-mutation';

export function LogoutButton() {
  const router = useRouter();

  const signoutMutation = useMutation({
    fn: signoutFn,
    onSuccess: () => {
      router.navigate({ to: '/signin', replace: true });
    },
  });
  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Logout'
      onClick={() => signoutMutation.mutate({})}
    >
      <LogOut className='h-5 w-5' />
    </Button>
  );
}
