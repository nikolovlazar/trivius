import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useMutation } from '@/shared/hooks/use-mutation';

import { signinFn } from '@/domains/user/functions/sign-in.function';
import { Auth } from '@/domains/user/ui/auth';

export const Route = createFileRoute('/_auth/signin')({
  component: SigninPage,
});

function SigninPage() {
  const router = useRouter();

  const signInMutation = useMutation({
    fn: signinFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: '/app' });
        return;
      }
    },
  });

  return (
    <Auth
      actionText='Sign in'
      status={signInMutation.status}
      onSubmit={(e: any) => {
        const formData = new FormData(e.target as HTMLFormElement);

        signInMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          },
        });
      }}
      afterSubmit={
        signInMutation.data ? (
          <>
            <div className='text-red-400'>{signInMutation.data.message}</div>
          </>
        ) : null
      }
    />
  );
}
