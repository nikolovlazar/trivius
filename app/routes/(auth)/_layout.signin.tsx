import { Auth } from "./-auth";
import { useMutation } from "@/hooks/use-mutation";
import { getSupabaseServerClient } from "@/utils/supabase/server";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

export const signinFn = createServerFn()
  .validator((d: any) => d as { email: string; password: string })
  .handler(async ({ data }) => {
    const { email, password } = data;

    const supabase = getSupabaseServerClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        error: true,
        message: "An error happened while signing in...",
      };
    }
  });

export const Route = createFileRoute("/(auth)/_layout/signin")({
  component: SigninPage,
});

function SigninPage() {
  const router = useRouter();

  const signInMutation = useMutation({
    fn: signinFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: "/app" });
        return;
      }
    },
  });

  return (
    <Auth
      actionText="Sign in"
      status={signInMutation.status}
      onSubmit={(e: any) => {
        const formData = new FormData(e.target as HTMLFormElement);

        signInMutation.mutate({
          data: {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
        });
      }}
      afterSubmit={
        signInMutation.data ? (
          <>
            <div className="text-red-400">{signInMutation.data.message}</div>
          </>
        ) : null
      }
    />
  );
}
