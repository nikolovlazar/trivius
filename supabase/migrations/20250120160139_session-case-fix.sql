alter table "public"."sessions" drop constraint "sessions_pkey";

drop index if exists "public"."sessions_pkey";

CREATE UNIQUE INDEX "sessions_pkey" ON public.sessions USING btree (id);

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";



