import { Link } from '@tanstack/react-router';

import { Button } from '@/domains/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/domains/shared/components/ui/card';
import { Input } from '@/domains/shared/components/ui/input';
import { Label } from '@/domains/shared/components/ui/label';

export function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
  ...props
}: {
  actionText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: 'pending' | 'idle' | 'success' | 'error';
  afterSubmit?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-6' {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{actionText}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(e);
            }}
          >
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input id='password' name='password' type='password' required />
              </div>
              <Button type='submit' disabled={status === 'pending'}>
                {status === 'pending' ? '...' : actionText}
              </Button>
            </div>
            {actionText == 'Sign in' ? (
              <div className='mt-4 text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link to='/signup' className='underline underline-offset-4'>
                  Sign up
                </Link>
              </div>
            ) : (
              <div className='mt-4 text-center text-sm'>
                Already have an account?{' '}
                <Link to='/signin' className='underline underline-offset-4'>
                  Sign in
                </Link>
              </div>
            )}

            {afterSubmit ? afterSubmit : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
