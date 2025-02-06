alter table "public"."questions" add column "right_answer" bigint not null;

alter table "public"."questions" add constraint "questions_right_answer_fkey" FOREIGN KEY (right_answer) REFERENCES answers(id) not valid;

alter table "public"."questions" validate constraint "questions_right_answer_fkey";



