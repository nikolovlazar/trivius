revoke delete on table "public"."answers" from "anon";

revoke insert on table "public"."answers" from "anon";

revoke references on table "public"."answers" from "anon";

revoke select on table "public"."answers" from "anon";

revoke trigger on table "public"."answers" from "anon";

revoke truncate on table "public"."answers" from "anon";

revoke update on table "public"."answers" from "anon";

revoke delete on table "public"."answers" from "authenticated";

revoke insert on table "public"."answers" from "authenticated";

revoke references on table "public"."answers" from "authenticated";

revoke select on table "public"."answers" from "authenticated";

revoke trigger on table "public"."answers" from "authenticated";

revoke truncate on table "public"."answers" from "authenticated";

revoke update on table "public"."answers" from "authenticated";

revoke delete on table "public"."answers" from "service_role";

revoke insert on table "public"."answers" from "service_role";

revoke references on table "public"."answers" from "service_role";

revoke select on table "public"."answers" from "service_role";

revoke trigger on table "public"."answers" from "service_role";

revoke truncate on table "public"."answers" from "service_role";

revoke update on table "public"."answers" from "service_role";

alter table "public"."answers" drop constraint "answers_question_id_fkey";

alter table "public"."questions" drop constraint "questions_game_id_fkey";

alter table "public"."questions" drop constraint "questions_right_answer_fkey";

alter table "public"."answers" drop constraint "answers_pkey";

drop index if exists "public"."answers_pkey";

drop table "public"."answers";

alter table "public"."questions" drop column "right_answer";

alter table "public"."questions" add column "answer_1_content" text not null;

alter table "public"."questions" add column "answer_2_content" text not null;

alter table "public"."questions" add column "answer_3_content" text not null;

alter table "public"."questions" add column "answer_4_content" text not null;

alter table "public"."questions" add column "right_answer_index" smallint not null default '0'::smallint;



