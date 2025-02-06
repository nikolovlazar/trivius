alter table "public"."questions" drop constraint "questions_answer_id_fkey";

alter table "public"."questions" drop column "answer_id";

alter table "public"."sessions" alter column "start_time" set not null;



