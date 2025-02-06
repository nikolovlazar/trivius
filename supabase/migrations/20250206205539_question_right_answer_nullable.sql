alter table "public"."questions" drop constraint "questions_right_answer_fkey";

alter table "public"."questions" alter column "right_answer" drop not null;

alter table "public"."questions" add constraint "questions_right_answer_fkey" FOREIGN KEY (right_answer) REFERENCES answers(id) ON DELETE SET NULL not valid;

alter table "public"."questions" validate constraint "questions_right_answer_fkey";



