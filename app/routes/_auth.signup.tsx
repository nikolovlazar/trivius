import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useMutation } from '@/domains/shared/hooks/use-mutation';
import { signupFn } from '@/domains/user/functions/sign-up.function';
import { Auth } from '@/domains/user/ui/auth';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();

  const signUpMutation = useMutation({
    fn: signupFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: '/signin' });
        return;
      }
    },
  });

  return (
    <Auth
      actionText='Sign up'
      status={signUpMutation.status}
      onSubmit={(e: any) => {
        const formData = new FormData(e.target as HTMLFormElement);

        signUpMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          },
        });
      }}
      afterSubmit={
        signUpMutation.data ? (
          <>
            <div className='text-red-400'>
              {signUpMutation.data.message}
              {signUpMutation.data.error.message}
            </div>
          </>
        ) : null
      }
    />
  );
}
