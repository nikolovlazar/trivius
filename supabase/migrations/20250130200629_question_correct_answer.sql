alter table "public"."questions" add column "answer_id" bigint not null;

alter table "public"."questions" add constraint "questions_answer_id_fkey" FOREIGN KEY (answer_id) REFERENCES answers(id) not valid;

alter table "public"."questions" validate constraint "questions_answer_id_fkey";



