import { getSupabaseServerClient } from "@/utils/supabase/server";
import { createServerFn } from "@tanstack/start";

export const fetchUser = createServerFn()
  .validator((jwt: string) => jwt)
  .handler(async ({ data: jwt }) => {
    const supabase = getSupabaseServerClient();
    const { data, error: _error } = await supabase.auth.getUser(jwt);

    if (!data.user?.email) {
      return { user: undefined };
    }

    return { user: data.user.email };
  });
