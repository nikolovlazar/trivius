import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Session, SessionInsert } from "@/types";
import { Share2 } from "lucide-react";
import { SessionShareModal } from "./session-share-modal";
import { createServerFn } from "@tanstack/start";
import { z } from "vinxi";
import { getSupabaseServerClient } from "@/utils/supabase/server";
import { toast } from "sonner";
import { useRouteContext, useRouter } from "@tanstack/react-router";

interface SessionManagerProps {
  gameId: number;
  gameName: string;
  sessions: Session[];
  isOpen: boolean;
  onClose: () => void;
  onNewSession: (newSession: SessionInsert) => void;
  onStopSession: (session: Session) => void;
}

export function SessionManager({
  gameId,
  gameName,
  sessions,
  isOpen,
  onClose,
  onNewSession,
  onStopSession,
}: SessionManagerProps) {
  const router = useRouter();
  const { user } = useRouteContext({ from: "/app" });
  const [shareSession, setShareSession] = useState<Session | null>(null);

  const startNewSession = async () => {
    const newSession: SessionInsert = {
      start_time: new Date().toISOString(),
      game_id: gameId,
      open: true,
    };

    const session = await createSession({
      data: {
        ...newSession,
        user_id: user!.id,
      },
    });

    if (session) {
      toast.success("Session created!");
      await router.invalidate();
    }
    onNewSession(newSession);
  };

  const endSession = (sessionId: number) => {
    const session = sessions.find((session) => session.id === sessionId);
    if (!session) return;

    onStopSession(session);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Sessions for {gameName}</DialogTitle>
            <DialogDescription>
              Start a new session or manage existing ones.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={startNewSession} className="w-full mb-4">
              Start New Session
            </Button>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div>
                    <p className="font-medium">Session {session.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.start_time).toLocaleString()}
                    </p>
                  </div>
                  {session.open && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShareSession(session)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant={session.open ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => endSession(session.id)}
                    disabled={session.open && !!session.end_time}
                  >
                    {session.open ? "End Session" : "Completed"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {shareSession && (
        <SessionShareModal
          isOpen={!!shareSession}
          onClose={() => setShareSession(null)}
          sessionId={shareSession.id}
          gameTitle={gameName}
        />
      )}
    </>
  );
}

const createSession = createServerFn()
  .validator(
    z.object({
      game_id: z.number(),
      start_time: z.string(),
      open: z.boolean().default(true),
      user_id: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("id", data.game_id)
      .single();

    const { data: gameGms, error: gameGmsError } = await supabase
      .from("games_gms")
      .select("*")
      .eq("game_id", data.game_id)
      .eq("gm_id", data.user_id)
      .single();

    if (!game || !gameGms || gameError || gameGmsError) {
      throw new Error("Game does not exist, or is not assigned to user");
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        game_id: data.game_id,
        start_time: data.start_time,
        open: data.open,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create session");
    }

    return session;
  });
