import { getSupabaseServerClient } from "@/utils/supabase/server";
import { createServerFn } from "@tanstack/start";
import { z } from "vinxi";
import { fetchUser } from "./fetch-user";

export const deleteGame = createServerFn()
  .validator(z.number())
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { user } = await fetchUser();

    if (!user) {
      throw new Error("User not found");
    }

    const { error: gameGmSelectError } = await supabase
      .from("games_gms")
      .select("*")
      .eq("game_id", data)
      .eq("gm_id", user.id)
      .single();

    if (gameGmSelectError) {
      throw new Error("Game does not belong to user");
    }

    const gameExists = supabase.from("games").delete().eq("id", data);

    const gameGmExists = supabase
      .from("games_gms")
      .delete()
      .eq("game_id", data)
      .eq("gm_id", user.id);

    const [{ error: gameError }, { error: gameGmDeleteError }] =
      await Promise.all([gameExists, gameGmExists]);

    if (gameError || gameGmDeleteError) {
      console.error(gameError, gameGmDeleteError);
      throw new Error("Failed to delete game");
    }
  });
