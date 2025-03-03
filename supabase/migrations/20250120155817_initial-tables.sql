create table "public"."answers" (
    "id" bigint generated by default as identity not null,
    "question_id" bigint not null,
    "content" text not null
);


create table "public"."games" (
    "id" bigint generated by default as identity not null,
    "title" text not null,
    "description" text,
    "answer_window" bigint default '30'::bigint
);


create table "public"."games_gms" (
    "gm_id" uuid not null,
    "game_id" bigint not null
);


create table "public"."players" (
    "id" bigint generated by default as identity not null,
    "session_id" bigint not null,
    "username" text not null
);


create table "public"."points" (
    "id" bigint generated by default as identity not null,
    "player_id" bigint not null,
    "question_id" bigint,
    "points_awarded" bigint not null default '0'::bigint
);


create table "public"."questions" (
    "id" bigint generated by default as identity not null,
    "game_id" bigint,
    "content" text not null
);


create table "public"."sessions" (
    "id" bigint generated by default as identity not null,
    "game_id" bigint not null,
    "start_time" timestamp without time zone not null default now(),
    "current_question" bigint,
    "open" boolean not null default false
);


CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

CREATE UNIQUE INDEX answers_pkey ON public.answers USING btree (id);

CREATE UNIQUE INDEX games_gms_pkey ON public.games_gms USING btree (gm_id, game_id);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX players_pkey ON public.players USING btree (id);

CREATE UNIQUE INDEX points_pkey ON public.points USING btree (id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

alter table "public"."answers" add constraint "answers_pkey" PRIMARY KEY using index "answers_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."games_gms" add constraint "games_gms_pkey" PRIMARY KEY using index "games_gms_pkey";

alter table "public"."players" add constraint "players_pkey" PRIMARY KEY using index "players_pkey";

alter table "public"."points" add constraint "points_pkey" PRIMARY KEY using index "points_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."answers" add constraint "answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_question_id_fkey";

alter table "public"."games_gms" add constraint "games_gms_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."games_gms" validate constraint "games_gms_game_id_fkey";

alter table "public"."games_gms" add constraint "games_gms_gm_id_fkey" FOREIGN KEY (gm_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."games_gms" validate constraint "games_gms_gm_id_fkey";

alter table "public"."players" add constraint "players_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE not valid;

alter table "public"."players" validate constraint "players_session_id_fkey";

alter table "public"."points" add constraint "points_player_id_fkey" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE not valid;

alter table "public"."points" validate constraint "points_player_id_fkey";

alter table "public"."points" add constraint "points_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON UPDATE CASCADE not valid;

alter table "public"."points" validate constraint "points_question_id_fkey";

alter table "public"."questions" add constraint "questions_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_game_id_fkey";

alter table "public"."sessions" add constraint "sessions_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_game_id_fkey";

alter table "public"."sessions" add constraint "sessions_current_question_fkey" FOREIGN KEY (current_question) REFERENCES questions(id) not valid;

alter table "public"."sessions" validate constraint "sessions_current_question_fkey";

grant delete on table "public"."answers" to "anon";

grant insert on table "public"."answers" to "anon";

grant references on table "public"."answers" to "anon";

grant select on table "public"."answers" to "anon";

grant trigger on table "public"."answers" to "anon";

grant truncate on table "public"."answers" to "anon";

grant update on table "public"."answers" to "anon";

grant delete on table "public"."answers" to "authenticated";

grant insert on table "public"."answers" to "authenticated";

grant references on table "public"."answers" to "authenticated";

grant select on table "public"."answers" to "authenticated";

grant trigger on table "public"."answers" to "authenticated";

grant truncate on table "public"."answers" to "authenticated";

grant update on table "public"."answers" to "authenticated";

grant delete on table "public"."answers" to "service_role";

grant insert on table "public"."answers" to "service_role";

grant references on table "public"."answers" to "service_role";

grant select on table "public"."answers" to "service_role";

grant trigger on table "public"."answers" to "service_role";

grant truncate on table "public"."answers" to "service_role";

grant update on table "public"."answers" to "service_role";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."games_gms" to "anon";

grant insert on table "public"."games_gms" to "anon";

grant references on table "public"."games_gms" to "anon";

grant select on table "public"."games_gms" to "anon";

grant trigger on table "public"."games_gms" to "anon";

grant truncate on table "public"."games_gms" to "anon";

grant update on table "public"."games_gms" to "anon";

grant delete on table "public"."games_gms" to "authenticated";

grant insert on table "public"."games_gms" to "authenticated";

grant references on table "public"."games_gms" to "authenticated";

grant select on table "public"."games_gms" to "authenticated";

grant trigger on table "public"."games_gms" to "authenticated";

grant truncate on table "public"."games_gms" to "authenticated";

grant update on table "public"."games_gms" to "authenticated";

grant delete on table "public"."games_gms" to "service_role";

grant insert on table "public"."games_gms" to "service_role";

grant references on table "public"."games_gms" to "service_role";

grant select on table "public"."games_gms" to "service_role";

grant trigger on table "public"."games_gms" to "service_role";

grant truncate on table "public"."games_gms" to "service_role";

grant update on table "public"."games_gms" to "service_role";

grant delete on table "public"."players" to "anon";

grant insert on table "public"."players" to "anon";

grant references on table "public"."players" to "anon";

grant select on table "public"."players" to "anon";

grant trigger on table "public"."players" to "anon";

grant truncate on table "public"."players" to "anon";

grant update on table "public"."players" to "anon";

grant delete on table "public"."players" to "authenticated";

grant insert on table "public"."players" to "authenticated";

grant references on table "public"."players" to "authenticated";

grant select on table "public"."players" to "authenticated";

grant trigger on table "public"."players" to "authenticated";

grant truncate on table "public"."players" to "authenticated";

grant update on table "public"."players" to "authenticated";

grant delete on table "public"."players" to "service_role";

grant insert on table "public"."players" to "service_role";

grant references on table "public"."players" to "service_role";

grant select on table "public"."players" to "service_role";

grant trigger on table "public"."players" to "service_role";

grant truncate on table "public"."players" to "service_role";

grant update on table "public"."players" to "service_role";

grant delete on table "public"."points" to "anon";

grant insert on table "public"."points" to "anon";

grant references on table "public"."points" to "anon";

grant select on table "public"."points" to "anon";

grant trigger on table "public"."points" to "anon";

grant truncate on table "public"."points" to "anon";

grant update on table "public"."points" to "anon";

grant delete on table "public"."points" to "authenticated";

grant insert on table "public"."points" to "authenticated";

grant references on table "public"."points" to "authenticated";

grant select on table "public"."points" to "authenticated";

grant trigger on table "public"."points" to "authenticated";

grant truncate on table "public"."points" to "authenticated";

grant update on table "public"."points" to "authenticated";

grant delete on table "public"."points" to "service_role";

grant insert on table "public"."points" to "service_role";

grant references on table "public"."points" to "service_role";

grant select on table "public"."points" to "service_role";

grant trigger on table "public"."points" to "service_role";

grant truncate on table "public"."points" to "service_role";

grant update on table "public"."points" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";

grant delete on table "public"."sessions" to "anon";

grant insert on table "public"."sessions" to "anon";

grant references on table "public"."sessions" to "anon";

grant select on table "public"."sessions" to "anon";

grant trigger on table "public"."sessions" to "anon";

grant truncate on table "public"."sessions" to "anon";

grant update on table "public"."sessions" to "anon";

grant delete on table "public"."sessions" to "authenticated";

grant insert on table "public"."sessions" to "authenticated";

grant references on table "public"."sessions" to "authenticated";

grant select on table "public"."sessions" to "authenticated";

grant trigger on table "public"."sessions" to "authenticated";

grant truncate on table "public"."sessions" to "authenticated";

grant update on table "public"."sessions" to "authenticated";

grant delete on table "public"."sessions" to "service_role";

grant insert on table "public"."sessions" to "service_role";

grant references on table "public"."sessions" to "service_role";

grant select on table "public"."sessions" to "service_role";

grant trigger on table "public"."sessions" to "service_role";

grant truncate on table "public"."sessions" to "service_role";

grant update on table "public"."sessions" to "service_role";



